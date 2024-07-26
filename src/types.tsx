import { TreeViewTypes } from "devextreme-react/tree-view";
import { ButtonTypes } from "devextreme-react/button";
import React from "react";

export interface HeaderProps {
  menuToggleEnabled: boolean;
  title?: string;
  toggleMenu: (e: ButtonTypes.ClickEvent) => void;
}

export interface SideNavigationMenuProps {
  selectedItemChanged: (e: TreeViewTypes.ItemClickEvent) => void;
  openMenu: (e: React.PointerEvent) => void;
  compactMode: boolean;
  onMenuReady: (e: TreeViewTypes.ContentReadyEvent) => void;
}

export interface UserPanelProps {
  menuMode: "context" | "list";
}

export interface User {
  email: string;
  avatarUrl: string;
}

export type AuthContextType = {
  user?: User;
  signIn: (
    email: string,
    password: string
  ) => Promise<{ isOk: boolean; data?: User; message?: string }>;
  signOut: () => void;
  loading: boolean;
};

export interface SideNavToolbarProps {
  title: string;
}

export interface SingleCardProps {
  title?: string;
  description?: string;
}

export type Handle = () => void;

interface NavigationData {
  currentPath: string;
}

export type NavigationContextType = {
  setNavigationData?: ({ currentPath }: NavigationData) => void;
  navigationData: NavigationData;
};

export type ValidationType = {
  value: string;
};

export type CustomizeBody = {
  CardTypeID: string;
  SortID: string;
  ID: string;
  CardGuide: string;
  CardType: string;
  CardName: string;
  ControlName: string;
  PrintType: string;
  ControlType: string;
  MainCr: string;
  MainID: string;
  PropertyName: string;
  PropertyValue: string;
  PropertyNumberValue: string;
};

export type Customize = {
  CardGuide: string;
  CardName: string;
  CardType: string;
  CardTypeID: string;
  ID: string;
  LatinName: string;
  Option01: string;
  PrintCount: string;
  ShowButton: string;
  CustomizeBody: Array<CustomizeBody>;
};

export type LocalArray = {
  IDS: Array<number>;
  ID: string;
  CardName: string;
};
