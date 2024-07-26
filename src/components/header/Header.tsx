import React, { useMemo } from "react";
import Toolbar, { Item } from "devextreme-react/toolbar";
import Button, { ButtonTypes } from "devextreme-react/button";
import { Button as TextBoxButton, TextBoxTypes } from "devextreme-react/text-box";
import UserPanel from "../user-panel/UserPanel";
import "./Header.scss";
import { Template } from "devextreme-react/core/template";
import type { HeaderProps } from "../../types";
import { TextBox } from "devextreme-react";
import { LOGO } from "../../assets";

export default function Header({ menuToggleEnabled, title, toggleMenu }: HeaderProps) {
  const passwordButton = useMemo<ButtonTypes.Properties>(
    () => ({
      icon: LOGO,
      stylingMode: "text",
      // onClick: () => {
      //     setPasswordMode((prevPasswordMode: string) =>
      //     prevPasswordMode === "text" ? "password" : "text"
      //   );
      // },
    }),
    []
  );
  return (
    <header className={"header-component"}>
      <Toolbar className={"header-toolbar"}>
        <Item
          visible={menuToggleEnabled}
          location={"after"}
          widget={"dxButton"}
          cssClass={"menu-button"}
        >
          <Button icon="menu" stylingMode="text" onClick={toggleMenu} />
        </Item>
        <Item location={"before"} cssClass={"header-title"} text={title} visible={!!title} />
        <Item location={"center"} cssClass={"header-search"}>
          <TextBox
            showClearButton
            stylingMode="outlined"
            placeholder="ابحث..."
            inputAttr={{ "aria-label": "Name" }}
          >
            <TextBoxButton name="password" location="before" options={{ icon: LOGO }} />
          </TextBox>
        </Item>
        <Item location={"after"} locateInMenu={"auto"} menuItemTemplate={"userPanelTemplate"}>
          {/* <Button
            className={'user-button authorization'}
            width={210}
            height={'100%'}
            stylingMode={'text'}
          > */}
          <UserPanel menuMode={"context"} />
          {/* </Button> */}
        </Item>

        <Template name={"userPanelTemplate"}>
          <UserPanel menuMode={"list"} />
        </Template>
      </Toolbar>
    </header>
  );
}
