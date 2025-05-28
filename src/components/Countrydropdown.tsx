import Select from "react-select";
import countries from "world-countries";
import { useEffect } from "react";
import { Path, PathValue } from "react-hook-form";
import { Controller, Control, UseFormSetValue } from "react-hook-form";

interface CountrySelectProps<T extends object> {
  label?: string;
  name: Path<T>;
  control: Control<T>;
   disabled?: boolean;
  setValue: UseFormSetValue<T>;
}

interface CountryOption {
  value: string;
  label: string;
  flag: string;
}

const formattedCountries: CountryOption[] = countries.map((country) => ({
  value: country.name.common,
  label: country.name.common,
  flag: `https://flagcdn.com/w40/${country.cca2.toLowerCase()}.png`,
}));

export default function CountrySelectComp<T extends object>({
  label,
  name,
  control,
  setValue,
   disabled,
}: CountrySelectProps<T>) {
  useEffect(() => {
    setValue(name, "" as PathValue<T, Path<T>>);
  }, [setValue, name]);

  return (
    <div className="relative">
      <Controller
        control={control}
        name={name}
        render={({ field }) => (
          <Select
            {...field}
            options={formattedCountries}
            getOptionLabel={(e) => e.label}
            getOptionValue={(e) => e.value}
            value={formattedCountries.find((c) => c.value === field.value)}
            onChange={(selected) => field.onChange(selected?.value)}
            formatOptionLabel={(option) => (
              <div className="flex items-center w-full">
                <img
                  src={option.flag}
                  alt={option.label}
                  className="w-5 h-5 mr-2"
                />
                {option.label}
              </div>
            )}
            isSearchable={!disabled}
            menuIsOpen={disabled ? false : undefined}
            className="flex w-full my-6 px-2.5 pt-2 pb-0.5 text-sm text-primary bg-transparent rounded-lg border border-primary focus:outline-none"
            styles={{
              control: (provided) => ({
                ...provided,
                width: "100%",
                boxShadow: "none",
                "&:hover": {
                  borderColor: "#4A90E2",
                },
              }),
              menu: (provided) => ({
                ...provided,
                width: "100%",
                backgroundColor: "#fff",
                boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
                border: "1px solid #4A90E2",
                zIndex: 9999,
              }),
              menuList: (provided) => ({
                ...provided,
                width: "100%",
                overflowX: "hidden",
              }),
            }}
          />
        )}
      />
      {label && (
        <label className="absolute text-sm text-primary duration-300 transform -translate-y-4 scale-75 top-2 z-[5] bg-white px-2 peer-focus:px-2 peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-4">
          {label}
        </label>
      )}
    </div>
  );
}
