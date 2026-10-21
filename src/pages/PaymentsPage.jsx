import { useSearchParams } from 'react-router';
import { getPaymentWeeks, getWeeklyPayments } from '../api/payments.js';
import EmptyState from '../components/EmptyState.jsx';
import ErrorState from '../components/ErrorState.jsx';
import LoadingState from '../components/LoadingState.jsx';
import PageHeader from '../components/PageHeader.jsx';
import PaymentSummary from '../components/payments/PaymentSummary.jsx';
import SupplierPayments from '../components/payments/SupplierPayments.jsx';
import WeekChart from '../components/payments/WeekChart.jsx';
import WeekNavigator from '../components/payments/WeekNavigator.jsx';
import { useRequest } from '../hooks/useRequest.js';
import { formatDateRange } from '../utils/format.js';
import { currentIsoWeek, describeInvalidWeek } from '../utils/isoWeek.js';
import './PaymentsPage.css';

function readRequestedWeek(searchParams) {
  if (!searchParams.has('year') && !searchParams.has('week')) return null;

  return { year: Number(searchParams.get('year')), week: Number(searchParams.get('week')) };
}

function PaymentsPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const weeks = useRequest(getPaymentWeeks);

  const requested = readRequestedWeek(searchParams);
  const latestWeek = weeks.data?.[0];
  let selected = requested;
  if (!selected && latestWeek) selected = { year: latestWeek.year, week: latestWeek.week };
  if (!selected && (weeks.data || weeks.error)) selected = currentIsoWeek();

  const invalidMessage = selected ? describeInvalidWeek(selected) : '';
  const canLoad = Boolean(selected) && !invalidMessage;
  const fallbackWeek = latestWeek ? { year: latestWeek.year, week: latestWeek.week } : currentIsoWeek();
  const navigatorWeek = canLoad ? selected : fallbackWeek;
  const paymentsKey = canLoad ? `${selected.year}-${selected.week}` : 'sin-semana';
  const payments = useRequest(
    (signal) => (canLoad ? getWeeklyPayments(selected, signal) : Promise.resolve(null)),
    paymentsKey,
  );

  function selectWeek({ year, week }) {
    setSearchParams({ year: String(year), week: String(week) });
  }

  function retry() {
    payments.reload();
    if (weeks.error) weeks.reload();
  }

  function renderPayments() {
    if (invalidMessage) {
      return <EmptyState title="Esa semana no existe" text={invalidMessage} />;
    }

    if (payments.error) {
      return <ErrorState title="No se pudieron calcular los pagos" error={payments.error} onRetry={retry} />;
    }

    if (!payments.data) {
      return <LoadingState label="Calculando pagos de la semana…" />;
    }

    if (payments.data.suppliers.length === 0) {
      return (
        <EmptyState
          title={`No hay tickets en la semana ${payments.data.week} de ${payments.data.year}`}
          text={`${formatDateRange(payments.data.startDate, payments.data.endDate)} no se registraron compras, así que no hay pagos pendientes. Elige una de las semanas del gráfico.`}
        />
      );
    }

    return (
      <div className="payments-page__results" aria-busy={payments.loading}>
        <PaymentSummary payments={payments.data} />
        <SupplierPayments
          key={paymentsKey}
          suppliers={payments.data.suppliers}
          weekTotal={payments.data.summary.total}
        />
      </div>
    );
  }

  return (
    <>
      <PageHeader
        title="Pagos semanales"
        description="Elige una semana ISO para ver cuánto corresponde pagar a cada proveedor y el detalle de sus tickets."
      />

      <section className="payments-page__selector" aria-label="Elegir semana">
        {selected && (
          <WeekNavigator
            key={`${navigatorWeek.year}-${navigatorWeek.week}`}
            selected={navigatorWeek}
            onSelect={selectWeek}
          />
        )}

        {weeks.error && (
          <p className="payments-page__weeks-error" role="alert">
            No se pudo cargar el resumen de semanas: {weeks.error.message}
          </p>
        )}
        {weeks.data?.length > 0 && <WeekChart weeks={weeks.data} selected={selected} />}
        {weeks.data?.length === 0 && (
          <p className="payments-page__no-weeks">Todavía no hay tickets registrados en ninguna semana.</p>
        )}
        {!weeks.data && !weeks.error && <LoadingState label="Cargando semanas…" />}
      </section>

      {selected && renderPayments()}
    </>
  );
}

export default PaymentsPage;
