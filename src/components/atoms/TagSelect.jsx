import { Select } from "chakra-react-select";
import { useEffect, useMemo, useState } from "react";

// ライブラリのラップ
export const TagSelect = ({ useTags, onChange, valueTags }) => {
  const [tags, setTags] = useState([]);

  useEffect(() => {
    const fetchTags = async () => {
      // eslint-disable-next-line react-hooks/rules-of-hooks
      const result = await useTags();
      setTags(result);
    };

    fetchTags();
  }, [useTags]);

  const options = useMemo(() => {
    return tags?.map((tag) => ({
      label: tag.name,
      value: tag.id,
    }));
  }, [tags]);

  const value = useMemo(() => {
    return valueTags?.map(({ tagId }) => {
      const label = tags?.find((tag) => tag.id === tagId)?.name || "";
      return {
        label: label,
        value: tagId,
      };
    });
  }, [tags, valueTags]);
  return (
    <Select
      chakraStyles={{
        dropdownIndicator: (provided) => ({
          ...provided,
          background: "gray.100",
        }),
        control: (provided) => ({
          ...provided,
          backgroundColor: "gray.200",
          borderRadius: "8px",
          border: "1px solid #000",
          borderColor: "gray.300",
          height: "40px",
        }),
      }}
      isMulti={true}
      onChange={onChange}
      options={options}
      placeholder="タグを選択..."
      size="sm"
      value={value}
      variant="filled"
    />
  );
};
