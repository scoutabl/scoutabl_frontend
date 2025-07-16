import { SCOUTABL_PURPLE_SECONDARY, SCOUTABL_TEXT } from "@/lib/constants";
import { cn } from "@/lib/utils";
import Dropdown from "../ui/dropdown";
import { EllipsisVertical } from "lucide-react";
import EyeIcon from "@/assets/eyeIcon.svg?react";

const AddedTest = ({ test, order }) => {
  const { name } = test || {};
  const notSet = test == null;

  return (
    <div
      className={cn(
        "flex flex-row items-center justify-between w-full rounded-xl px-4 py-1",
        notSet ? "text-black" : "text-white font-semibold"
      )}
      style={{
        background: notSet ? SCOUTABL_PURPLE_SECONDARY : SCOUTABL_TEXT,
      }}
    >
      <span
        className="whitespace-nowrap overflow-hidden text-ellipsis max-w-[160px] inline-block align-bottom"
        title={notSet ? "Not Set" : name}
      >
        {`Test ${order}: `}
        {notSet ? "Not Set" : name}
      </span>
      {!notSet && (
        <Dropdown
          className="bg-inherit border-none focus:outline-none focus-visible:ring-0 focus-visible:ring-offset-0 focus:ring-0 hover:bg-inherit p-0 hover:text-inherit"
          options={[
            {
              value: "preview",
              display: "Preview Test",
              icon: <EyeIcon className="size-5" />,
            },
          ]}
          icon={<EllipsisVertical className="ml-2" />}
          iconOnly
        />
      )}
    </div>
  );
};

export default AddedTest;
