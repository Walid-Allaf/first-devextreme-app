import React, { useCallback, useEffect, useState } from "react";
import "./home.scss";
import {
  Box,
  Button,
  ContextMenu,
  List,
  Popup,
  SelectBox,
  TextBox,
  Validator,
} from "devextreme-react";
import Switch, { SwitchTypes } from "devextreme-react/switch";
import ResponsiveBox, { Row, Col, Item, Location } from "devextreme-react/responsive-box";
import { ADD, DELETE, EDIT, NOCONTENT } from "../../assets";
import { rightNav } from "../../constants";
import Scheduler, { Resource, SchedulerTypes } from "devextreme-react/scheduler";
import axios from "../../api/axios";
import { Customize, CustomizeBody, LocalArray } from "../../types";
import { ValueChangedEvent } from "devextreme/ui/select_box";

export default function Home() {
  const screen = (width: number) => (width < 700 ? "sm" : "lg");
  const [popupVisible, setPopupVisible] = useState(false);
  const [selectedValue, setSelectedValue] = useState<string>("");
  const [selectedValues, setSelectedValues] = useState<Array<CustomizeBody>>([]);
  const [loading, setLoading] = useState<Boolean>(false);
  const [scheduler, setScheduler] = useState<Array<Customize>>([]);
  const [step3, setStep3] = useState<Array<CustomizeBody>>([]);
  const [archive, setArchive] = useState<{ TypeGuide: string; DataSource: Array<any> }>({
    TypeGuide: "",
    DataSource: [],
  });
  const [navItems, setNavItems] = useState(JSON.parse(localStorage.getItem("navItems") || "[]"));
  const [dataSource, setDataSource] = useState<Array<any>>([]);
  let localArray = JSON.parse(localStorage.getItem("navItems") || "[]");
  const [data, setData] = useState<Array<any>>([]);
  const handlePopupHidden = useCallback(() => {
    setPopupVisible(false);
    setSelectedValue("");
    setSelectedValues([]);
    setStep3([]);
    setArchive({ TypeGuide: "", DataSource: [] });
  }, [setPopupVisible]);
  const handleAdd = async () => {
    handlePopupHidden();
    let cardCols = dataSource.map((data) => data.PropertyValue).join(",");
    await axios
      .get(
        `/Archive/GetArchive?ID=&First=0&Last=&Before=&After=&CardGuide=&TypeGuide=${archive.TypeGuide}&ArchiveTables=[{"TableID":"30334","FilterIndex":"6","TableColumns":"CardNumber,CardNumber2,NumberValue2,AgentGuide,ItemGuide,Notes"},{"TableID":"30341","FilterIndex":"27","TableColumns":"CardDate,CardNumber,BooleanValue01,Notes2"}]&CardColumns=CardDate,${cardCols}`
      )
      .then((res) => {
        setLoading(false);
        setData((prev) => {
          return [
            ...prev,
            ...JSON.parse(res.data).ArchiveHeader.Archive.map((data: any) => ({
              text: data.TextValue01,
              startDate: new Date(data.CardDate),
              endDate: new Date(data.CardDate),
              id: data.ID,
              color: "#727bd2",
            })),
          ];
        });
        console.log(JSON.parse(res.data).ArchiveHeader.Archive);
        localArray.push({
          ID: scheduler.filter((item) => item.ID === selectedValue)[0].ID,
          CardName: scheduler.filter((item) => item.ID === selectedValue)[0].CardName,
          IDS: JSON.parse(res.data).ArchiveHeader.Archive.map((item: any) => item.ID),
        });
      })
      .catch((err) => {
        setLoading(false);
      });

    localStorage.setItem("navItems", JSON.stringify(localArray));
    setNavItems(localArray);
  };

  const deletItem = (item: LocalArray) => {
    localStorage.setItem(
      "navItems",
      JSON.stringify(localArray.filter((el: LocalArray) => el.ID !== item.ID))
    );
    localArray = localArray.filter((el: LocalArray) => el.ID !== item.ID);
    setNavItems(localArray);
    setData((prev) => {
      return [prev.filter((el: any) => item.IDS.includes(el.id))];
    });
    console.log(data);
  };
  const productWithPlaceholderLabel = { "aria-label": "Product With Placeholder" };

  const onValueChanged = (e: ValueChangedEvent) => {
    console.log(e.previousValue);
    setSelectedValue(e.value);
    setSelectedValues(
      scheduler
        .filter((item) => item.ID === e.value)[0]
        ?.CustomizeBody.filter(
          (el: CustomizeBody) => el.ControlType === "3" && el.PropertyName === "Caption"
        )
    );
    console.log(
      scheduler
        .filter((item) => item.ID === e.value)[0]
        ?.CustomizeBody.filter((el: CustomizeBody) => el.PropertyName === "DataSource")
    );
    setArchive({
      ...archive,
      TypeGuide: scheduler
        .filter((item) => item.ID === e.value)[0]
        ?.CustomizeBody.filter((el: CustomizeBody) => el.PropertyName === "TypeGuide")[0]
        ?.PropertyValue,
    });
  };

  const Step3 = (e: ValueChangedEvent) => {
    console.log("value", e.value);
    setStep3(
      scheduler
        .filter((item) => item.ID === selectedValue)[0]
        ?.CustomizeBody.filter(
          (el: CustomizeBody) =>
            (el.ControlType === "3" || el.ControlType === "1") && el.PropertyName === "Caption"
        )
    );
    console.log(
      "step3",
      scheduler
        .filter((item) => item.ID === selectedValue)[0]
        ?.CustomizeBody.filter(
          (el: CustomizeBody) =>
            (el.ControlType === "3" || el.ControlType === "1") && el.PropertyName === "DataSource"
        )
        .map((el: CustomizeBody) => el.PropertyValue)
        .join(",")
    );
    setArchive({
      ...archive,
      DataSource: scheduler
        .filter((item) => item.ID === selectedValue)[0]
        ?.CustomizeBody.filter(
          (el: CustomizeBody) =>
            (el.ControlType === "3" || el.ControlType === "1") && el.PropertyName === "DataSource"
        ),
      // .map((el: CustomizeBody) => el.PropertyValue)
      // .join(","),
    });
  };

  const valueChanged = (e: SwitchTypes.ValueChangedEvent, value: string) => {
    console.log(typeof e.value, typeof value);
    if (e.value === true) {
      setDataSource([
        ...dataSource,
        scheduler
          .filter((item) => item.ID === selectedValue)[0]
          ?.CustomizeBody.filter(
            (el: CustomizeBody) =>
              (el.ControlType === "3" || el.ControlType === "1") &&
              el.PropertyName === "DataSource" &&
              el.ID === value
          )[0],
      ]);
    } else {
      setDataSource(dataSource.filter((item) => item.ID !== value));
    }
    console.log(dataSource);
  };

  const renderPopup = () => {
    return (
      <div className="popup-property-details">
        <div className="popup-title">
          <p>إضافة عنصر للأجندة</p>
          <Button icon="remove" stylingMode="contained" onClick={handlePopupHidden} />
        </div>

        {!loading && (
          <div className="text-field">
            <div>
              <p className="dx-field-label">اختيار النافذة</p>
              <SelectBox
                id="custom-templates"
                stylingMode="outlined"
                dataSource={scheduler}
                inputAttr={productWithPlaceholderLabel}
                displayExpr="CardName"
                valueExpr="ID"
                onValueChanged={onValueChanged}
                defaultValue={selectedValue}
                // fieldRender={Field}
                // itemRender={ItemRender}
              />
            </div>

            <div>
              <p className="dx-field-label">عنوان الاضافة</p>
              <TextBox
                showClearButton
                stylingMode="outlined"
                inputAttr={{ "aria-label": "Name" }}
              />
            </div>
          </div>
        )}
        {loading && <p>جاري التحميل...</p>}
        {!loading && selectedValues.length > 0 && (
          <div className="text-field">
            <div>
              <p className="dx-field-label">استنادا على حقل</p>
              <SelectBox
                id="custom-templates"
                stylingMode="outlined"
                dataSource={selectedValues}
                inputAttr={productWithPlaceholderLabel}
                displayExpr="PropertyValue"
                valueExpr="ID"
                // defaultValue={selectedValues[0].ID}
                onValueChanged={Step3}
              />
            </div>
          </div>
        )}
        {!loading && selectedValue && (
          <div className="text-field">
            <div className="switches">
              {step3.map((step) => (
                <div className="single-switch">
                  <div className="dx-field-value">
                    <Switch defaultValue={false} onValueChanged={(e) => valueChanged(e, step.ID)} />
                  </div>
                  <p className="dx-field-label">{step.PropertyValue}</p>
                </div>
              ))}
            </div>
          </div>
        )}
        <div className="buttons">
          <Button
            text="إدراج"
            width={170}
            height={45}
            stylingMode="contained"
            type="default"
            onClick={handleAdd}
            disabled={archive.DataSource.length === 0}
          />
          <Button
            text="إلغاء الأمر"
            width={170}
            height={45}
            // elementAttr={favButtonAttrs}
            onClick={handlePopupHidden}
          />
        </div>
      </div>
    );
  };

  const currentDate = new Date();
  const views: SchedulerTypes.ViewType[] = ["day", "week", "workWeek", "month"];

  const getScheduler = async () => {
    setLoading(true);
    await axios
      .get(`/Customize/GetCustomize?CardGuide=`)
      .then((res) => {
        setLoading(false);
        setScheduler(res.data.Customize.CustomizeHeader);
        console.log(res.data.Customize.CustomizeHeader);
      })
      .catch((err) => {
        setLoading(false);
      });
  };

  useEffect(() => {
    getScheduler();
  }, []);
  return (
    <div className="demo-container">
      <ResponsiveBox singleColumnScreen="sm" screenByWidth={screen}>
        <Row ratio={1}></Row>

        <Col ratio={1}></Col>
        <Col ratio={3} screen="lg"></Col>
        <Col ratio={1}></Col>
        {/* LEFT */}
        <Item>
          <Location row={0} col={2} screen="lg"></Location>
          <Location row={2} col={0} screen="sm"></Location>
          <div className="left-side-bar item">
            <div className="add">
              <Button icon={ADD} width={55} height={55} onClick={() => setPopupVisible(true)} />
              <p>إضافة الى الأجندة</p>
            </div>
            {navItems.length === 0 ? (
              <div className="no-content">
                <img src={NOCONTENT} alt="no-content" width={"100%"} height={160} />
                <p>لا يوجد عناصر بعد!</p>
              </div>
            ) : (
              <div className="nav-items">
                <List
                  dataSource={navItems}
                  itemRender={(item, index) => (
                    <div key={index} className="nav-item">
                      <div className="icons">
                        <div onClick={() => deletItem(item)} className="nav-item-icon">
                          <img src={DELETE} alt="delete" width={15} height={15} />
                        </div>
                        <div
                          onClick={() => {
                            setSelectedValue(item.ID);
                            setSelectedValues(
                              scheduler
                                .filter((el) => el.ID === item.ID)[0]
                                ?.CustomizeBody.filter(
                                  (el: CustomizeBody) =>
                                    el.ControlType === "3" && el.PropertyName === "Caption"
                                )
                            );
                            setStep3(
                              scheduler
                                .filter((el) => el.ID === item.ID)[0]
                                ?.CustomizeBody.filter(
                                  (el: CustomizeBody) =>
                                    (el.ControlType === "3" || el.ControlType === "1") &&
                                    el.PropertyName === "Caption"
                                )
                            );
                            setTimeout(() => {
                              setPopupVisible(true);
                            }, 500);
                          }}
                          className="nav-item-icon"
                        >
                          <img src={EDIT} alt="edit" width={15} height={15} />
                        </div>
                      </div>
                      <p>{item.CardName}</p>
                    </div>
                  )}
                />
              </div>
            )}
          </div>
        </Item>
        {/* MIDDEL */}
        <Item>
          <Location row={0} col={1} screen="lg"></Location>
          <Location row={1} col={0} colspan={2} screen="sm"></Location>
          <div className="scheduler item">
            <Scheduler
              timeZone="America/Los_Angeles"
              dataSource={data}
              views={views}
              defaultCurrentView="month"
              defaultCurrentDate={currentDate}
              height={730}
              startDayHour={9}
            />
            {/* <Resource
              dataSource={data}
              allowMultiple={true}
              displayExpr="TextValue01"
              valueExpr="TextValue01"
              fieldExpr="CardDate"
              label="TextValue01"
              useColorAsDefault={true}
            /> */}
          </div>
        </Item>
        {/* RIGHT */}
        <Item>
          <Location row={0} col={0} screen="lg"></Location>
          <Location row={2} col={1} screen="sm"></Location>
          <div className="right-side-bar item">
            <ul>
              {rightNav.map((item, index) => (
                <li key={index}>{item.title}</li>
              ))}
            </ul>
          </div>
        </Item>
      </ResponsiveBox>

      <div className="dialog">
        <Popup
          width={660}
          height={590}
          showTitle={false}
          title="إضافة عنصر للأجندة"
          dragEnabled={false}
          hideOnOutsideClick={true}
          visible={popupVisible}
          onHiding={handlePopupHidden}
          contentRender={renderPopup}
          showCloseButton={true}
        />
      </div>
    </div>
  );
}
