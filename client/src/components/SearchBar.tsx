interface SearchBarPropsType {
  placeholder: string;
}
export default function SearchBar({ placeholder }: SearchBarPropsType) {
  return (
    <input
      type="text"
      placeholder={placeholder}
      className="w-[300px] p-2  rounded-md text-sm border border-secondary bg-search-icon bg-no-repeat focus:outline-none focus:ring-2 focus:ring-primary"
      style={{ backgroundPosition: "right 12px center" }}
    />
  );
}
