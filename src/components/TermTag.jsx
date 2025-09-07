import React from "react";
import { Tag, Tooltip } from "@carbon/react";

/**
 * A Carbon Tag wrapped with a Carbon Tooltip
 * Props:
 *  - term: short code (e.g., "cinstr")
 *  - label: full name (tooltip heading)
 *  - desc: definition (tooltip body)
 */
export default function TermTag({ term, label, desc, type = "cool-gray" }) {
  return (
    <Tooltip
      align="bottom-start"
      label={label}
      description={desc}
      leaveDelayMs={50}
      enterDelayMs={50}
    >
      <Tag type={type} title={label} style={{ cursor: "help" }}>
        {term}
      </Tag>
    </Tooltip>
  );
}