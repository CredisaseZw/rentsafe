import React, { useState, useRef } from "react";
import { Button } from "@/components/ui/button";

interface ExpandableTextProps {
  text: string;
}

const ExpandableText: React.FC<ExpandableTextProps> = ({ text }) => {
  const [expanded, setExpanded] = useState(false);
  const buttonRef = useRef<HTMLButtonElement>(null);

  return (
    <div className="flex items-start gap-3 max-w-[250px]">
     <div
  className={`${expanded ? "whitespace-normal break-words max-w-[250px]" : "line-clamp-1 break-words max-w-[250px]"} flex-1`}
  title={text}
>
  {text}
</div>
      <Button
        ref={buttonRef}
        onClick={() => setExpanded((prev) => !prev)}
        variant="outline"
        className="py-0"
        size="xs"
      >
        {expanded ? "-" : "+"}
      </Button>
    </div>
  );
};

export default ExpandableText;
