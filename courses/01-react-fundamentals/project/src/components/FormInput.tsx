/**
 * Reusable form input component.
 */
interface FormInputProps {
  id?: string;
  value?: string;
  onChange?: (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => void;
  label?: string;
  type?: string;
  placeholder?: string;
  error?: string;
  textarea?: boolean;
}

export default function FormInput({
  id,
  value = "",
  onChange,
  label,
  type = "text",
  placeholder,
  error,
  textarea = false,
}: FormInputProps) {
  return (
    <div>
      {label && <label htmlFor={id}>{label}</label>}

      {textarea ? (
        <textarea
          id={id}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
        />
      ) : (
        <input
          id={id}
          type={type}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
        />
      )}

      {error && <p>{error}</p>}
    </div>
  );
}