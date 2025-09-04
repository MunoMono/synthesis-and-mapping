import React from "react";
import {
  Header,
  HeaderName,
  HeaderGlobalBar,
  HeaderGlobalAction,
} from "@carbon/react";
import { Moon, Sun } from "@carbon/icons-react";

function HeaderBar({ theme, toggleTheme }) {
  const isDark = theme === "g90";

  return (
    <Header aria-label="Reference Library">
      <HeaderName href="#" prefix="">
        Graham Newman synthesis and mapping
      </HeaderName>

      <HeaderGlobalBar>
        <HeaderGlobalAction
          aria-label="Toggle theme"
          onClick={toggleTheme}
          tooltipAlignment="end"
        >
          {isDark ? <Sun size={20} /> : <Moon size={20} />}
        </HeaderGlobalAction>
      </HeaderGlobalBar>
    </Header>
  );
}

export default HeaderBar;