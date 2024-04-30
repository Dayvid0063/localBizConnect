import "./widget.scss";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import PersonOutlinedIcon from "@mui/icons-material/PersonOutlined";
import AccountBalanceWalletOutlinedIcon from "@mui/icons-material/AccountBalanceWalletOutlined";
import ShoppingCartOutlinedIcon from "@mui/icons-material/ShoppingCartOutlined";
import MonetizationOnOutlinedIcon from "@mui/icons-material/MonetizationOnOutlined";
import {
  usersApiRequests,
  ordersApiRequests,
  earningsApiRequests,
  balanceApiRequests,
} from "../../api";
import { Link } from "react-router-dom";
import { useCallback, useEffect, useState } from "react";

const Widget = ({ type }) => {
  const [count, setCount] = useState(0);
  const [percentageDiff, setPercentageDiff] = useState(0);
  const [isPositivePercentage, setIsPositivePercentage] = useState(true);

  const fetchData = useCallback(
    async (apiRequest, demoCount) => {
      try {
        const response = await apiRequest();
        console.log(response.data);
        setCount(response.data.count || response.data.length || demoCount);
      } catch (error) {
        console.error(`Error fetching ${type} count:`, error);
      }
    },
    [type]
  );

  useEffect(() => {
    const demoCount = 100;

    switch (type) {
      case "user":
        fetchData(usersApiRequests.getUsersCount, count);
        break;
      case "order":
        fetchData(ordersApiRequests.getOrders, count);
        break;
      case "earning":
        fetchData(earningsApiRequests.getEarningsCount, demoCount);
        break;
      case "balance":
        fetchData(balanceApiRequests.getBalanceCount, demoCount);
        break;
      default:
        break;
    }

    if (type !== "user" && type !== "order") {
      const previousMonthCount = 90;
      const diff = demoCount - previousMonthCount;
      const percentDiff = ((diff / previousMonthCount) * 100).toFixed(2);
      setPercentageDiff(percentDiff);
      setIsPositivePercentage(diff >= 0);
    } else if (type === "user" || type === "order") {
      const previousMonthCount = 8;
      const diff = count - previousMonthCount;
      const percentDiff = ((diff / previousMonthCount) * 100).toFixed(2);
      setPercentageDiff(percentDiff);
      setIsPositivePercentage(diff >= 0);
    }
  }, [type, count, fetchData]);

  let data;

  switch (type) {
    case "user":
      data = {
        title: "USERS",
        isMoney: false,
        link: {
          to: "/users",
          text: "See all users",
        },
        icon: (
          <PersonOutlinedIcon
            className="icon"
            style={{
              color: "crimson",
              backgroundColor: "rgba(255, 0, 0, 0.2)",
            }}
          />
        ),
      };
      break;
    case "order":
      data = {
        title: "ORDERS",
        isMoney: false,
        link: {
          to: "/orders",
          text: "View all orders",
        },
        icon: (
          <ShoppingCartOutlinedIcon
            className="icon"
            style={{
              backgroundColor: "rgba(218, 165, 32, 0.2)",
              color: "goldenrod",
            }}
          />
        ),
      };
      break;
    case "earning":
      data = {
        title: "EARNINGS",
        isMoney: true,
        link: "View net earnings",
        icon: (
          <MonetizationOnOutlinedIcon
            className="icon"
            style={{ backgroundColor: "rgba(0, 128, 0, 0.2)", color: "green" }}
          />
        ),
      };
      break;
    case "balance":
      data = {
        title: "BALANCE",
        isMoney: true,
        link: "See details",
        icon: (
          <AccountBalanceWalletOutlinedIcon
            className="icon"
            style={{
              backgroundColor: "rgba(128, 0, 128, 0.2)",
              color: "purple",
            }}
          />
        ),
      };
      break;
    default:
      break;
  }

  return (
    <div className="widget">
      <div className="left">
        <span className="title">{data.title}</span>
        <span className="counter">
          {data.isMoney && "$"} {count ? count : 100}
        </span>
        <span className="link">
          <Link to={data.link.to}>{data.link.text}</Link>
        </span>
      </div>
      <div
        className={`right ${isPositivePercentage ? "positive" : "negative"}`}
      >
        <div
          className={`percentage ${
            isPositivePercentage ? "positive" : "negative"
          }`}
        >
          <KeyboardArrowUpIcon />
          {percentageDiff} %
        </div>
        {data.icon}
      </div>
    </div>
  );
};

export default Widget;
