import React, { useState } from "react";
import { Tooltip, Grow } from "@mui/material";
import { watchListData } from "../data/data";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import { BarChartOutlined, MoreHoriz } from "@mui/icons-material";
import BuyComponent from "./BuyComponent";
import SellComponent from "./SellComponent";
export default function WatchList() {
  const [tradeState, setTradeState] = useState({
    type: null,
    stock: null,
  });

  const handleBuyButton = (stock) => {
    setTradeState({
      type: "BUY",
      stock,
    });
  };
  
  const handleSellButton = (stock) => {
    console.log("clicked");
    setTradeState({
      type: "SELL",
      stock,
    });
  };
  return (
    <>
      <div className="watchlist">
        <div className="watchlist-data">
    <p className="watchlist-title">Watchlist</p>
          <ul>
            {watchListData.map((stock, index) => (
              <WatchListItem
              stock={stock}
              key={index}
              handleBuyButton={handleBuyButton}
              handleSellButton={handleSellButton}
              />
            ))}
          </ul>
        </div>
      </div>
      {tradeState.type === "BUY" && (
        <BuyComponent
        stock={tradeState.stock}
        closeBuy={() =>
          setTradeState({
            type: null,
            stock: null,
          })
        }
        />
      )}
      {tradeState.type === "SELL" && (
        <SellComponent
        stock={tradeState.stock}
          closeBuy={() =>
            setTradeState({
              type: null,
              stock: null,
            })
          }
        />
      )}
    </>
  );
}

const WatchListItem = ({ stock, handleBuyButton, handleSellButton }) => {
  const [showWatchListAction, setShowWatchListAction] = useState(false);

  const handleMouseEnter = (e) => {
    setShowWatchListAction(true);
  };

  const handleMouseLeave = (e) => {
    setShowWatchListAction(false);
  };

  return (
    <li
      className="watchlist-li"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <div className="item">
        <p className={stock.isDown ? "down" : "up"}>{stock.name}</p>
        <div className="itemInfo">
          <span className="percent">{stock.percent}</span>
          <span>
            {stock.isDown ? (
              <KeyboardArrowDownIcon className="down" />
            ) : (
              <KeyboardArrowUpIcon className="up" />
            )}
          </span>
          <span className="price">{stock.price}</span>
        </div>
        {showWatchListAction && (
          <WatchListActions
            handleBuyButton={handleBuyButton}
            handleSellButton={handleSellButton}
            stock={stock}
          />
        )}
      </div>
    </li>
  );
};

const WatchListActions = ({ stock, handleBuyButton, handleSellButton }) => {
  return (
    <span className="actions">
      <span>
        <Tooltip
          title="Buy (B)"
          placement="top"
          arrowslot={{ transition: Grow }}
        >
          <button className="buy" onClick={() => handleBuyButton(stock)}>
            Buy
          </button>
        </Tooltip>
        <Tooltip
          title="Sell (s)"
          placement="top"
          arrowslot={{ transition: Grow }}
        >
          <button className="sell" onClick={() => handleSellButton(stock)}>
            Sell
          </button>
        </Tooltip>
        <Tooltip
          title="More (M)"
          placement="top"
          arrowslot={{ transition: Grow }}
        >
          <button className="more">
            <MoreHoriz />
          </button>
        </Tooltip>
        <Tooltip
          title="Analytics (A)"
          placement="top"
          arrowslot={{ transition: Grow }}
        >
          <button className="analytics">
            <BarChartOutlined />
          </button>
        </Tooltip>
      </span>
    </span>
  );
};
