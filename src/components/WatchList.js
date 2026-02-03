import React, { useState } from "react";
import { Tooltip, Grow } from "@mui/material";
import { watchListData } from "../data/data";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import { BarChartOutlined, MoreHoriz } from "@mui/icons-material";
import BuyComponent from "./BuyComponent";
export default function WatchList() {
  const [isBuyComponentOpen, setIsBuyComponentOpen] = useState(null);

  const handleBuyButton = (stock) => {
    setIsBuyComponentOpen(stock);
  };
  return (
    <>
      <div className="watchlist">
        <div className="watchlist-container">
          <p className="text-muted">
            Search eg:infy, bse, nifty fut weekly, gold mcx
          </p>
          <p style={{ color: "grey" }}>{watchListData.length}/50</p>
        </div>
        <div className="watchlist-data">
          <ul>
            {watchListData.map((stock, index) => (
              <WatchListItem
                stock={stock}
                key={index}
                handleBuyButton={handleBuyButton}
              />
            ))}
          </ul>
        </div>
      </div>
      {isBuyComponentOpen && (
        <BuyComponent
          stock={isBuyComponentOpen}
          closeBuy={() => setIsBuyComponentOpen(null)}
        />
      )}
    </>
  );
}

const WatchListItem = ({ stock, handleBuyButton }) => {
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
          <WatchListActions handleBuyButton={handleBuyButton} stock={stock} />
        )}
      </div>
    </li>
  );
};

const WatchListActions = ({ stock, handleBuyButton }) => {
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
          <button className="sell">Sell</button>
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
