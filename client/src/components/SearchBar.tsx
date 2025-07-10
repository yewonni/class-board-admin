interface SearchBarPropsType {
  placeholder: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export function SearchBar({
  placeholder,
  value,
  onChange,
}: SearchBarPropsType) {
  return (
    <input
      type="text"
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      className="w-[300px] p-2  rounded-md text-sm border border-secondary bg-search-icon bg-no-repeat focus:outline-none focus:ring-2 focus:ring-primary"
      style={{ backgroundPosition: "right 12px center" }}
    />
  );
}
