const CustomHeader = ({ wallet }) => {
  // Extract the first 6 and last 4 characters of the wallet address
  const truncatedWallet = wallet
    ? `${wallet.substring(0, 6)}...${wallet.substring(wallet.length - 4)}`
    : "Not Connected"

  return (
    <div className="profile-section">
      <img src="styles/userPic.svg" alt="Profile" className="profile-avatar" />
      <div className="profile-info">
        <div className="profile-name">User11</div>
        <div className="profile-meta">
          <span>Free Guest</span>
          <span>January 2025</span>
        </div>
      </div>
      {wallet && <div className="connected-badge">Connected</div>}
    </div>
  )
}

export default CustomHeader
