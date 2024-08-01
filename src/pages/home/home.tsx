import React, { useEffect, useState } from "react";
import "./home.scss";
import { Button, List, Popup, SelectBox, TextBox } from "devextreme-react";
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
  const [step2, setStep2] = useState<string>("");
  const [step3, setStep3] = useState<Array<CustomizeBody>>([]);
  const [archive, setArchive] = useState<{ TypeGuide: string; DataSource: Array<any> }>({
    TypeGuide: "",
    DataSource: [],
  });
  const [navItems, setNavItems] = useState(JSON.parse(localStorage.getItem("navItems") || "[]"));
  const [dataSource, setDataSource] = useState<Array<any>>([]);
  let localArray = JSON.parse(localStorage.getItem("navItems") || "[]");
  const [data, setData] = useState<Array<any>>([]);
  const [dialogType, setDialogType] = useState<"add" | "edit">("add");
  const [color, setColor] = useState<"#8697FF" | "#32E844" | "#D84E45" | "#ADDCFF">("#8697FF");
  const Colors: (typeof color)[] = ["#8697FF", "#32E844", "#D84E45", "#ADDCFF"];
  const [title, setTitle] = useState<string>("");

  const handlePopupHidden = () => {
    setPopupVisible(false);
    setSelectedValue("");
    setSelectedValues([]);
    setStep3([]);
    setDataSource([]);
    setTitle("");
    setStep2("");
    setColor("#8697FF");
    setArchive({ TypeGuide: "", DataSource: [] });
  };
  const handleAdd = async () => {
    handlePopupHidden();
    let cardCols = dataSource.map((data) => data.PropertyValue);
    if (dialogType === "edit") {
      setData((prev) => {
        return [
          ...prev.filter(
            (el) =>
              !JSON.parse(localStorage.getItem("navItems") || "[]")
                .filter((item: any) => item.ID === selectedValue)[0]
                .IDS.includes(el.id)
          ),
        ];
      });
      localArray = localArray.filter((el: any) => el.ID !== selectedValue);
    }
    await axios
      .get(
        `/Archive/GetArchive?ID=&First=0&Last=&Before=&After=&CardGuide=&TypeGuide=${
          archive.TypeGuide
        }&ArchiveTables=[{"TableID":"30334","FilterIndex":"6","TableColumns":"CardNumber,CardNumber2,NumberValue2,AgentGuide,ItemGuide,Notes"},{"TableID":"30341","FilterIndex":"27","TableColumns":"CardDate,CardNumber,BooleanValue01,Notes2"}]&CardColumns=CardDate,${cardCols.join(
          ","
        )}`
      )
      .then((res) => {
        setLoading(false);
        setData((prev) => {
          return [
            ...prev,
            ...JSON.parse(res.data).ArchiveHeader.Archive.map((data: any) => ({
              description: cardCols.map((col) => data[col] + "\n"),
              text: title,
              startDate: new Date(data.CardDate),
              endDate: new Date(data.CardDate),
              id: data.ID,
              color: color,
            })),
          ];
        });

        localArray.push({
          ID: scheduler.filter((item) => item.ID === selectedValue)[0].ID,
          CardName: scheduler.filter((item) => item.ID === selectedValue)[0].CardName,
          IDS: JSON.parse(res.data).ArchiveHeader.Archive.map((item: any) => item.ID),
          cardCols: cardCols,
          step2: step2,
          color: color,
          title: title,
        });
        localStorage.setItem("navItems", JSON.stringify(localArray));
        setNavItems(localArray);
      })
      .catch((err) => {
        setLoading(false);
      });
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
  };
  const productWithPlaceholderLabel = { "aria-label": "Product With Placeholder" };

  const onValueChanged = (e: ValueChangedEvent) => {
    // console.log(e.previousValue);
    setSelectedValue(e.value);
    setSelectedValues(
      scheduler
        .filter((item) => item.ID === e.value)[0]
        ?.CustomizeBody.filter(
          (el: CustomizeBody) => el.ControlType === "3" && el.PropertyName === "Caption"
        )
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
    setStep2(e.value);
    setStep3(
      scheduler
        .filter((item) => item.ID === selectedValue)[0]
        ?.CustomizeBody.filter(
          (el: CustomizeBody) =>
            (el.ControlType === "3" || el.ControlType === "1") &&
            el.PropertyName === "Caption" &&
            el.ID !== e.value
        )
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
  };

  const handleTitleChange = (e: any) => {
    setTitle(e);
  };

  const renderPopup = () => {
    return (
      <div className="popup-property-details">
        <div className="popup-title">
          {dialogType === "add" ? <p>إضافة عنصر للأجندة</p> : <p>تعديل عنصر في الأجندة</p>}
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
                value={selectedValue}
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
                onValueChange={(e) => handleTitleChange(e)}
                value={title}
              />
            </div>
          </div>
        )}
        {loading && <p>جاري التحميل...</p>}
        {!loading && selectedValues && (
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
                value={step2}
                onValueChanged={Step3}
              />
            </div>
          </div>
        )}
        {!loading && selectedValue && step2 && (
          <div className="text-field">
            <div className="switches">
              {step3.map((step) => (
                <div className="single-switch">
                  <p className="dx-field-label">{step.PropertyValue}</p>
                  <div className="dx-field-value">
                    <Switch
                      defaultValue={
                        dataSource.filter((item: any) => item.ID === step.ID).length > 0
                      }
                      onValueChanged={(e) => valueChanged(e, step.ID)}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
        {!loading && selectedValue && (
          <div className="text-field colors">
            <div>
              <p className="dx-field-label">تحديد اللون في الاجندة</p>
              <div className="circles">
                {Colors.map((el) => (
                  <div
                    style={{ background: el, border: color === el ? "2px solid #000" : "none" }}
                    className="circle"
                    onClick={() => setColor(el)}
                  ></div>
                ))}
              </div>
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
        // console.log(res.data.Customize.CustomizeHeader);
      })
      .catch((err) => {
        setLoading(false);
      });
  };

  const addDialog = () => {
    setPopupVisible(true);
    setDialogType("add");
  };

  const editDialog = (id: string) => {
    setSelectedValue(id);
    setSelectedValues(
      scheduler
        .filter((el) => el.ID === id)[0]
        ?.CustomizeBody.filter(
          (el: CustomizeBody) => el.ControlType === "3" && el.PropertyName === "Caption"
        )
    );
    setStep2(
      JSON.parse(localStorage.getItem("navItems") || "[]").filter((item: any) => item.ID === id)[0]
        .step2
    );
    setStep3(
      scheduler
        .filter((el) => el.ID === id)[0]
        ?.CustomizeBody.filter(
          (el: CustomizeBody) =>
            (el.ControlType === "3" || el.ControlType === "1") &&
            el.PropertyName === "Caption" &&
            el.ID !== step2
        )
    );
    setDataSource(
      scheduler
        .filter((item) => item.ID === id)[0]
        ?.CustomizeBody.filter(
          (el: CustomizeBody) =>
            (el.ControlType === "3" || el.ControlType === "1") &&
            el.PropertyName === "DataSource" &&
            JSON.parse(localStorage.getItem("navItems") || "[]")
              .filter((item: any) => item.ID === id)[0]
              .cardCols.includes(el.PropertyValue)
        )
    );
    setTitle(
      JSON.parse(localStorage.getItem("navItems") || "[]").filter((item: any) => item.ID === id)[0]
        .title
    );
    setColor(
      JSON.parse(localStorage.getItem("navItems") || "[]").filter((item: any) => item.ID === id)[0]
        .color
    );
    setDialogType("edit");
    setPopupVisible(true);
  };

  const onAppointmentRendered = (e: any) => {
    const { color } = e.appointmentData;
    const backgroundColor = color; // Default color
    e.appointmentElement.style.backgroundColor = backgroundColor;
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
              <Button icon={ADD} width={55} height={55} onClick={addDialog} />
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
                        <div onClick={() => editDialog(item.ID)} className="nav-item-icon">
                          <img src={EDIT} alt="edit" width={15} height={15} />
                        </div>
                      </div>
                      <div className="nav-item-text">
                        <p>{item.CardName}</p>
                        <p>اسم اضافة {item.title}</p>
                      </div>
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
              height={640}
              startDayHour={9}
              onAppointmentRendered={onAppointmentRendered}
            />
          </div>
        </Item>
        {/* RIGHT */}
        <Item>
          <Location row={0} col={0} screen="lg"></Location>
          <Location row={2} col={1} screen="sm"></Location>
          <div className="right-side-bar item">
            <ul>
              {rightNav.map((item, index) => (
                <li key={index}>
                  <img src={item.icon} alt={item.title} width={32} height={32} />
                  <p>{item.title}</p>
                </li>
              ))}
            </ul>
          </div>
        </Item>
      </ResponsiveBox>

      <div className="dialog">
        <Popup
          // width={"100%"}
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
