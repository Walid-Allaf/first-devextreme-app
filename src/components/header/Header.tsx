import React, { useMemo } from "react";
import Toolbar, { Item } from "devextreme-react/toolbar";
import Button, { ButtonTypes } from "devextreme-react/button";
import { Button as TextBoxButton, TextBoxTypes } from "devextreme-react/text-box";
import UserPanel from "../user-panel/UserPanel";
import "./Header.scss";
import { Template } from "devextreme-react/core/template";
import type { HeaderProps } from "../../types";
import { SelectBox, TextBox } from "devextreme-react";
import { FLAG, GLETTER, LOGO, NOTIFICATION } from "../../assets";
import { useScreenSize } from "../../utils/media-query";

export default function Header({ menuToggleEnabled, title, toggleMenu }: HeaderProps) {
  const { isLarge, isMedium } = useScreenSize();
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

  const leftSide = () => {
    return (
      <div className="left-side-header">
        <div className="username">
          <img src={GLETTER} alt="g" width={50} height={50} />
          <div>
            <p>اسم المستخدم</p>
            <p>مجموعة المدراء</p>
          </div>
        </div>
        <img src={NOTIFICATION} alt="notification" width={21} height={24} />
        <div className="dx-field-value">
          <img src={FLAG} alt="flag" />
          <SelectBox
            items={["English", "Arabic"]}
            defaultValue={"English"}
            stylingMode="outlined"
            width={130}
          />
        </div>
      </div>
    );
  };

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
        <Item
          location={"before"}
          cssClass={"header-title"}
          // text={title}
          visible={isMedium || isLarge}
          render={leftSide}
        />
        <Item location={"center"} cssClass={"header-search"}>
          <TextBox
            visible={isMedium || isLarge}
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
