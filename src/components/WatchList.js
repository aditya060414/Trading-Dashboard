import React, { useState } from "react";
import { Tooltip, Grow } from "@mui/material";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import { BarChartOutlined, MoreHoriz } from "@mui/icons-material";
import BuyComponent from "./BuyComponent";
import SellComponent from "./SellComponent";

export default function WatchList({ watchlistStocks = [] }) {
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
            {watchlistStocks.length === 0 && (
              <li className="watchlist-empty">No stocks added</li>
            )}
            {watchlistStocks.map((stock, id) => (
              <WatchListItem
                stock={stock}
                key={id}
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

  return (
    <li
      className="watchlist-li"
      onMouseEnter={() => setShowWatchListAction(true)}
      onMouseLeave={() => setShowWatchListAction(false)}
    >
      <div className="item">
        <p>{stock.symbol}</p>
        <div className="itemInfo">
          <span className="percent">{stock.close}</span>
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
