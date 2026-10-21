import { useRef, useState } from 'react';
import { Link } from 'react-router';
import { useCatalogs } from '../../context/catalogsContext.js';
import { formatMillis } from '../../utils/format.js';
import ErrorState from '../ErrorState.jsx';
import {
  MAX_LINES,
  countErrors,
  createLine,
  lineAmountMillis,
  mapServerErrors,
  toTicketPayload,
  validateTicketForm,
} from './ticketFormModel.js';
import './TicketForm.css';

function FieldError({ id, message }) {
  if (!message) return null;

  return (
    <p id={id} className="field__error">
      {message}
    </p>
  );
}

function errorProps(id, message) {
  return {
    'aria-invalid': Boolean(message),
    'aria-describedby': message ? id : undefined,
  };
}

function validationMessage(errorCount) {
  if (errorCount === 0) return '';
  if (errorCount === 1) return 'Revisa el campo marcado antes de guardar.';
  return `Revisa los ${errorCount} campos marcados antes de guardar.`;
}

function TicketForm({ initialValues, submitLabel, pendingLabel, cancelTo, cancelState, onSubmit }) {
  const catalogs = useCatalogs();
  const formRef = useRef(null);
  const [values, setValues] = useState(initialValues);
  const [errors, setErrors] = useState({ lines: {} });
  const [formMessage, setFormMessage] = useState('');
  const [validateOnChange, setValidateOnChange] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  function applyChange(nextValues) {
    setValues(nextValues);

    if (validateOnChange) {
      const validation = validateTicketForm(nextValues);
      setErrors(validation);
      setFormMessage(validationMessage(countErrors(validation)));
    }
  }

  function updateField(field, value) {
    applyChange({ ...values, [field]: value });
  }

  function updateLine(key, field, value) {
    applyChange({
      ...values,
      lines: values.lines.map((line) => (line.key === key ? { ...line, [field]: value } : line)),
    });
  }

  function addLine() {
    applyChange({ ...values, lines: [...values.lines, createLine()] });
  }

  function removeLine(key) {
    applyChange({ ...values, lines: values.lines.filter((line) => line.key !== key) });
  }

  function focusFirstInvalidField() {
    requestAnimationFrame(() => formRef.current?.querySelector('[aria-invalid="true"]')?.focus());
  }

  async function handleSubmit(event) {
    event.preventDefault();

    const validation = validateTicketForm(values);
    const errorCount = countErrors(validation);

    setValidateOnChange(true);
    setErrors(validation);

    if (errorCount > 0) {
      setFormMessage(validationMessage(errorCount));
      focusFirstInvalidField();
      return;
    }

    setFormMessage('');
    setSubmitting(true);

    try {
      await onSubmit(toTicketPayload(values));
    } catch (error) {
      const result = mapServerErrors(error, values);
      setErrors(result.errors);
      setFormMessage(result.message);
      setSubmitting(false);
      focusFirstInvalidField();
    }
  }

  if (catalogs.error) {
    return (
      <ErrorState
        title="No se pudieron cargar proveedores, lands y productos"
        error={catalogs.error}
        onRetry={catalogs.reload}
      />
    );
  }

  const catalogsReady = !catalogs.loading;
  const totalMillis = values.lines.reduce((sum, line) => sum + (lineAmountMillis(line) ?? 0), 0);

  return (
    <form ref={formRef} className="ticket-form" noValidate onSubmit={handleSubmit}>
      {formMessage && (
        <div className="ticket-form__message" role="alert">
          {formMessage}
        </div>
      )}

      <fieldset className="ticket-form__section" disabled={submitting}>
        <legend className="ticket-form__legend">Datos del ticket</legend>
        <div className="ticket-form__grid">
          <label className="field">
            <span className="field__label">Código</span>
            <input
              className="input"
              value={values.code}
              maxLength={20}
              autoComplete="off"
              {...errorProps('error-code', errors.code)}
              onChange={(event) => updateField('code', event.target.value)}
            />
            <FieldError id="error-code" message={errors.code} />
          </label>

          <label className="field">
            <span className="field__label">Fecha</span>
            <input
              type="date"
              className="input"
              value={values.date}
              {...errorProps('error-date', errors.date)}
              onChange={(event) => updateField('date', event.target.value)}
            />
            <FieldError id="error-date" message={errors.date} />
          </label>

          <label className="field">
            <span className="field__label">Proveedor</span>
            <select
              className="input"
              value={values.supplierId}
              disabled={!catalogsReady}
              {...errorProps('error-supplier', errors.supplierId)}
              onChange={(event) => updateField('supplierId', event.target.value)}
            >
              <option value="">{catalogsReady ? 'Elige un proveedor' : 'Cargando proveedores…'}</option>
              {catalogs.suppliers.map((supplier) => (
                <option key={supplier.id} value={supplier.id}>
                  {supplier.name} ({supplier.code})
                </option>
              ))}
            </select>
            <FieldError id="error-supplier" message={errors.supplierId} />
          </label>

          <label className="field">
            <span className="field__label">Land</span>
            <select
              className="input"
              value={values.landId}
              disabled={!catalogsReady}
              {...errorProps('error-land', errors.landId)}
              onChange={(event) => updateField('landId', event.target.value)}
            >
              <option value="">{catalogsReady ? 'Elige un land' : 'Cargando lands…'}</option>
              {catalogs.lands.map((land) => (
                <option key={land.id} value={land.id}>
                  {land.name} ({land.code})
                </option>
              ))}
            </select>
            <FieldError id="error-land" message={errors.landId} />
          </label>
        </div>
      </fieldset>

      <fieldset className="ticket-form__section" disabled={submitting}>
        <legend className="ticket-form__legend">Líneas</legend>
        <div className="line-editor">
          <div className="line-editor__head" aria-hidden="true">
            <span>Producto</span>
            <span>Cantidad</span>
            <span>Precio</span>
            <span className="line-editor__amount-head">Importe</span>
            <span />
          </div>

          {values.lines.map((line, index) => {
            const lineErrors = errors.lines[line.key] || {};
            const amount = lineAmountMillis(line);
            const errorId = (field) => `error-${line.key}-${field}`;

            return (
              <div key={line.key} className="line-editor__row" role="group" aria-label={`Línea ${index + 1}`}>
                <label className="field line-editor__product">
                  <span className="field__label line-editor__label">Producto</span>
                  <select
                    className="input"
                    value={line.productId}
                    disabled={!catalogsReady}
                    {...errorProps(errorId('product'), lineErrors.productId)}
                    onChange={(event) => updateLine(line.key, 'productId', event.target.value)}
                  >
                    <option value="">{catalogsReady ? 'Elige un producto' : 'Cargando productos…'}</option>
                    {catalogs.products.map((product) => (
                      <option key={product.id} value={product.id}>
                        {product.name} ({product.code})
                      </option>
                    ))}
                  </select>
                  <FieldError id={errorId('product')} message={lineErrors.productId} />
                </label>

                <label className="field line-editor__quantity">
                  <span className="field__label line-editor__label">Cantidad</span>
                  <input
                    className="input numeric"
                    inputMode="numeric"
                    autoComplete="off"
                    placeholder="0"
                    value={line.quantity}
                    {...errorProps(errorId('quantity'), lineErrors.quantity)}
                    onChange={(event) => updateLine(line.key, 'quantity', event.target.value)}
                  />
                  <FieldError id={errorId('quantity')} message={lineErrors.quantity} />
                </label>

                <label className="field line-editor__price">
                  <span className="field__label line-editor__label">Precio</span>
                  <input
                    className="input numeric"
                    inputMode="decimal"
                    autoComplete="off"
                    placeholder="0.000"
                    value={line.price}
                    {...errorProps(errorId('price'), lineErrors.price)}
                    onChange={(event) => updateLine(line.key, 'price', event.target.value)}
                  />
                  <FieldError id={errorId('price')} message={lineErrors.price} />
                </label>

                <div className="line-editor__amount">
                  <span className="field__label line-editor__label">Importe</span>
                  <output className="numeric">{amount === null ? '—' : formatMillis(amount)}</output>
                </div>

                <button
                  type="button"
                  className="line-editor__remove"
                  disabled={values.lines.length === 1}
                  aria-label={`Quitar línea ${index + 1}`}
                  onClick={() => removeLine(line.key)}
                >
                  Quitar
                </button>
              </div>
            );
          })}
        </div>

        <FieldError id="error-details" message={errors.details} />

        <div className="line-editor__footer">
          <button
            type="button"
            className="button button--secondary"
            disabled={values.lines.length >= MAX_LINES}
            onClick={addLine}
          >
            Agregar línea
          </button>
          <p className="line-editor__total">
            Total del ticket
            <strong className="numeric">{formatMillis(totalMillis)}</strong>
          </p>
        </div>
      </fieldset>

      <div className="ticket-form__actions">
        <Link to={cancelTo} state={cancelState} className="button button--secondary">
          Cancelar
        </Link>
        <button type="submit" className="button button--primary" disabled={submitting || !catalogsReady}>
          {submitting ? pendingLabel : submitLabel}
        </button>
      </div>
    </form>
  );
}

export default TicketForm;
