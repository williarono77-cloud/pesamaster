import { formatMoney } from '../utils/formatMoney.js'

export default function HeaderRow({ balance, onMenuClick, onChatClick }) {
  const displayBalance = balance !== null && balance !== undefined ? formatMoney(balance) : '0.00 KES'

  return (
    <div className="header-row">
      <h1 className="header-row__logo">Aviator</h1>
      <div className="header-row__balance">{displayBalance}</div>
      <div className="header-row__icons">
        <button type="button" className="header-row__icon-btn" onClick={onChatClick} aria-label="Chat">
          💬
        </button>
        <button type="button" className="header-row__icon-btn" onClick={onMenuClick} aria-label="Menu">
          ☰
        </button>
      </div>
    </div>
  )
}
