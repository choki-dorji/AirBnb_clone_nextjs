import React, { useCallback } from "react";
import { IconType } from "react-icons";
import { useRouter, useSearchParams } from "next/navigation";
import qs from "query-string";

interface categortprops {
  icon: IconType;
  label: string;
  selected?: boolean;
}

const CategoryBox: React.FC<categortprops> = ({
  icon: Icon,
  label,
  selected,
}) => {
  const router = useRouter();
  const params = useSearchParams();

  const handleClick = useCallback(() => {
    let currentQuery = {};
    console.log(params.toString());
    if (params) {
      currentQuery = qs.parse(params.toString());
    }
    console.log(currentQuery);

    const updatedquery: any = {
      ...currentQuery,
      category: label,
    };
    console.log(updatedquery, currentQuery);

    // when cliked aganin delete
    if (params?.get("category") === label) {
      delete updatedquery.category;
    }
    const url = qs.stringifyUrl(
      {
        url: "/",
        query: updatedquery,
      },
      { skipNull: true }
    );
    console.log(url, updatedquery);
    router.push(url);
  }, [label, params, router]);

  return (
    <div
      onClick={handleClick}
      className={`
        flex flex-col items-center justify-content gap-2 p-3 border-b-2 hover:text-neutral-800 transition cursor-pointer
        ${selected ? "border-b-neutral-800" : "border-transparent"}
        ${selected ? "text-neutral-800" : "text-neutral-500"}
  `}
    >
      <Icon size={26} />
      <div className="font-medium text-sm">{label}</div>
    </div>
  );
};

export default CategoryBox;
