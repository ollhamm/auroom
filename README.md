AuRoom - Product Source of Truth
Version: 1.0.0 (Hackathon MVP)
Last Updated: January 27, 2026
Status: Pre-Development
📑
Table of Contents

1.  Product Overview
2.  Technical Stack
3.  Core Architecture
4.
5.
6.
7.
8.
9.
10. Smart Contract Specification
    User Stories & Flows
    Frontend Requirements
    Integration Points
    Success Metrics
    Out of Scope
    Deployment Plan
    📘
    Product Overview
    Vision Statement
    AuRoom adalah protokol lending berbasis emas digital (RWA) yang memungkinkan pengguna mendapatkan
    likuiditas fiat tanpa menjual aset emas mereka.
    Hackathon MVP Goal
    Membangun core onchain lending protocol yang memungkinkan:
    Deposit XAUT sebagai collateral
    Borrow IDRX (Indonesian Rupiah stablecoin) secara instant
    Partial repayment dengan fleksibilitas penuh
    Automated liquidation untuk menjaga protocol solvency
    Value Proposition
    "Cash out your cash needs, while keeping your gold."
    Pengguna tidak perlu menjual emas saat butuh dana darurat—cukup gunakan sebagai collateral untuk
    mendapatkan pinjaman.
    🛠
    Technical Stack
    Smart Contract
    Language: Solidity ^0.8.20
    Framework: Foundry
    Testing: Forge (unit tests + fuzzing)
    Network: Base Sepolia (testnet)
    Frontend
    Framework: Next.js 14 (App Router)
    Web3 Library: wagmi v2 + viem
    UI Components: shadcn/ui + Tailwind CSS
    State Management: Zustand (untuk app state) + React Query (untuk blockchain state)
    Wallet Connection: RainbowKit atau ConnectKit
    Infrastructure
    Price Oracle: Chainlink (XAUT/USD feed)
    RPC Provider: Base public RPC + Alchemy/QuickNode fallback
    Deployment: Vercel (frontend) + Foundry script (contracts)
    🏗
    Core Architecture
    System Components
    ┌─────────────────────────────────────────────────────────┐
    │
    ┌─────────────────────────────────────────────────────────┐
    │
    FRONTEND (Next.js)  
     FRONTEND (Next.js)  
    │
    │
    │ ┌──────────┐ ┌──────────┐ ┌──────────┐  
    │ ┌──────────┐ ┌──────────┐ ┌──────────┐  
    │ │ Dashboard│ │ Borrow │ │ Repay │  
    │ │ Dashboard│ │ Borrow │ │ Repay │  
    │
    │
    │ └──────────┘ └──────────┘ └──────────┘  
    │ └──────────┘ └──────────┘ └──────────┘  
    │
    │
    │
    └────────────────────┬────────────────────────────────────┘
    │ wagmi + viem
    ▼ ▼
    │
    │
    └────────────────────┬────────────────────────────────────┘
    │ wagmi + viem
    ┌─────────────────────────────────────────────────────────┐
    ┌─────────────────────────────────────────────────────────┐
    │
    SMART CONTRACTS (Base Sepolia)  
     SMART CONTRACTS (Base Sepolia)  
    │
    │
    Contract Architecture
    📜
    Smart Contract Specification
    Contract: AuRoomVault.sol
    State Variables
    │ │ │ │
    │ ┌────────────────────────────────────────────────┐ │ │ ┌────────────────────────────────────────────────┐ │
    │ │ AuRoomVault.sol (Main Contract) │ │ │ │ AuRoomVault.sol (Main Contract) │ │
    │ │ - deposit() │ │ │ │ - deposit() │ │
    │ │ - borrow() │ │ │ │ - borrow() │ │
    │ │ - repay() │ │ │ │ - repay() │ │
    │ │ - withdraw() │ │ │ │ - withdraw() │ │
    │ │ - liquidate() │ │ │ │ - liquidate() │ │
    │ └────────────────────────────────────────────────┘ │ │ └────────────────────────────────────────────────┘ │
    │ │ │ │
    │ ┌──────────────┐ ┌──────────────┐ │ │ ┌──────────────┐ ┌──────────────┐ │
    │ │ XAUT Token │ │ IDRX Token │ │ │ │ XAUT Token │ │ IDRX Token │ │
    │ │ (Collateral) │ │ (Loan Asset) │ │ │ │ (Collateral) │ │ (Loan Asset) │ │
    │ └──────────────┘ └──────────────┘ │ │ └──────────────┘ └──────────────┘ │
    │ │ │ │
    │ ┌────────────────────────────────────────────────┐ │ │ ┌────────────────────────────────────────────────┐ │
    │ │ Chainlink Price Feed (XAUT/USD) │ │ │ │ Chainlink Price Feed (XAUT/USD) │ │
    │ └────────────────────────────────────────────────┘ │ │ └────────────────────────────────────────────────┘ │
    └─────────────────────────────────────────────────────────┘ └─────────────────────────────────────────────────────────┘
    solidity
    // Core Data Structure // Core Data Structure
    struct struct Position Position { {
    uint256 uint256 collateralAmount collateralAmount; ; // XAUT deposited // XAUT deposited
    uint256 uint256 borrowedAmount borrowedAmount; ; // IDRX borrowed // IDRX borrowed
    uint256 uint256 lastInterestUpdate lastInterestUpdate; ; // Timestamp // Timestamp
    uint256 uint256 accruedInterest accruedInterest; ; // Interest yang sudah terhitung // Interest yang sudah terhitung
    } }
    mapping mapping( (address address =>=> Position Position) ) public public positions positions; ;
    solidity
    Core Functions
11. deposit(uint256 amount)
    Purpose: Deposit XAUT sebagai collateral
    Logic:
    Frontend Requirements:
    Input field untuk amount (dengan max button)
    Display current collateral balance
    Show estimated borrowing capacity setelah deposit
    // Tokens // Tokens
    IERC20 IERC20 public public immutable XAUT immutable XAUT; ; // Collateral token // Collateral token
    IERC20 IERC20 public public immutable IDRX immutable IDRX; ; // Loan token // Loan token
    // Chainlink Oracle // Chainlink Oracle
    AggregatorV3Interface AggregatorV3Interface public public xautUsdPriceFeed xautUsdPriceFeed; ;
    // Protocol Parameters // Protocol Parameters
    uint256 uint256 public public constant constant BASE_LTV BASE_LTV = = 5050; ; // Tier 1: 50% // Tier 1: 50%
    uint256 uint256 public public constant constant MID_LTV MID_LTV = = 6060; ; // Tier 2: 60% // Tier 2: 60%
    uint256 uint256 public public constant constant MAX_LTV MAX_LTV = = 7070; ; // Tier 3: 70% // Tier 3: 70%
    uint256 uint256 public public constant constant LIQUIDATION_THRESHOLD LIQUIDATION_THRESHOLD = = 8080; ; // 80% // 80%
    uint256 uint256 public public constant constant LIQUIDATION_PENALTY LIQUIDATION_PENALTY = = 1 1; ; // 1% // 1%
    uint256 uint256 public public constant constant ANNUAL_INTEREST_RATE ANNUAL_INTEREST_RATE = = 500 500; ; // 5% (basis points) // 5% (basis points)
    // User tier mapping (untuk dynamic LTV) // User tier mapping (untuk dynamic LTV)
    mapping mapping( (address address =>=> uint8 uint8) ) public public userTier userTier; ; // 1=50%, 2=60%, 3=70% // 1=50%, 2=60%, 3=70%
    solidity
    function function deposit deposit( (uint256 uint256 amount amount) ) external external { {
    require require( (amount amount > > 0 0, , "Amount must be > 0" "Amount must be > 0") ); ;
            // Transfer XAUT from user // Transfer XAUT from user
        XAUT    XAUT. .transferFrom transferFrom( (msgmsg. .sender sender, ,  address address( (this this) ), , amount amount) ); ;

            // Update position // Update position
        positions    positions[ [msgmsg. .sender sender] ]. .collateralAmount collateralAmount +=+= amount amount; ;

            emit emit  Deposited Deposited( (msgmsg. .sender sender, , amount amount) ); ;
    } }
12. borrow(uint256 idrixAmount)
    Purpose: Pinjam IDRX berdasarkan collateral
    Logic:
    solidity
    function function borrow borrow( (uint256 uint256 idrixAmount idrixAmount) ) external external { {
    Position Position storage storage pos pos = = positions positions[ [msgmsg. .sender sender] ]; ;
    require require( (pos pos. .collateralAmount collateralAmount > > 0 0, , "No collateral" "No collateral") ); ;
            // Update interest terlebih dahulu // Update interest terlebih dahulu
            _updateInterest _updateInterest( (msgmsg. .sender sender) ); ;

            // Calculate max borrowable // Calculate max borrowable
            uint256 uint256 maxBorrow  maxBorrow = =  _calculateMaxBorrow _calculateMaxBorrow( (msgmsg. .sender sender) ); ;
            uint256 uint256 totalDebt  totalDebt = = pos pos. .borrowedAmount borrowedAmount + + pos pos. .accruedInterest accruedInterest; ;

            require require( (totalDebt totalDebt + + idrixAmount  idrixAmount <=<= maxBorrow maxBorrow, ,  "Exceeds borrowing capacity" "Exceeds borrowing capacity") ); ;

            // Update borrowed amount // Update borrowed amount
        pos    pos. .borrowedAmount borrowedAmount +=+= idrixAmount idrixAmount; ;
        pos    pos. .lastInterestUpdate lastInterestUpdate = = block block. .timestamp timestamp; ;

            // Transfer IDRX to user // Transfer IDRX to user
        IDRX    IDRX. .transfer transfer( (msgmsg. .sender sender, , idrixAmount idrixAmount) ); ;

            emit emit  Borrowed Borrowed( (msgmsg. .sender sender, , idrixAmount idrixAmount) ); ;
    } }
    function function \_calculateMaxBorrow \_calculateMaxBorrow( (address address user user) ) internal internal view view returns returns ( (uint256 uint256) ) { {
    Position Position memory memory pos pos = = positions positions[ [user user] ]; ;
            // Get XAUT price in USD from Chainlink // Get XAUT price in USD from Chainlink
            uint256 uint256 xautPrice  xautPrice = =  _getXAUTPrice _getXAUTPrice( () ); ;

            // Collateral value in USD (8 decimals from oracle) // Collateral value in USD (8 decimals from oracle)
            uint256 uint256 collateralValueUSD  collateralValueUSD = =  ( (pos pos. .collateralAmount collateralAmount * * xautPrice xautPrice) )  / /  1e18 1e18; ;

            // Get user's LTV based on tier // Get user's LTV based on tier
            uint256 uint256 ltvRatio  ltvRatio = =  _getUserLTV _getUserLTV( (user user) ); ;

            // Max borrow in USD // Max borrow in USD
            uint256 uint256 maxBorrowUSD  maxBorrowUSD = =  ( (collateralValueUSD collateralValueUSD * * ltvRatio ltvRatio) )  / /  100 100; ;

            // Convert to IDRX (assuming 1 IDRX = 1 USD / 15000) // Convert to IDRX (assuming 1 IDRX = 1 USD / 15000)
            // For hackathon: assume 1 IDRX = $0.000065 (1 USD = ~15,384 IDRX) // For hackathon: assume 1 IDRX = $0.000065 (1 USD = ~15,384 IDRX)
            uint256 uint256 maxBorrowIDRX  maxBorrowIDRX = = maxBorrowUSD  maxBorrowUSD * *  15384 15384; ;

            return return maxBorrowIDRX maxBorrowIDRX; ;
    } }
    function function \_getUserLTV \_getUserLTV( (address address user user) ) internal internal view view returns returns ( (uint256 uint256) ) { {
    Frontend Requirements:
    Real-time calculation of max borrowable amount
    Slider atau input untuk jumlah pinjaman
    Display current LTV setelah borrow
    Warning jika mendekati liquidation threshold
13. repay(uint256 amount)
    Purpose: Bayar sebagian atau seluruh pinjaman
    Logic:
    uint8 uint8 tier tier = = userTier userTier[ [user user] ]; ;
    ifif ( (tier tier ==== 0 0) ) return return BASE_LTV BASE_LTV; ; // Default tier 1 // Default tier 1
    ifif ( (tier tier ==== 1 1) ) return return BASE_LTV BASE_LTV; ;
    ifif ( (tier tier ==== 2 2) ) return return MID_LTV MID_LTV; ;
    ifif ( (tier tier ==== 3 3) ) return return MAX_LTV MAX_LTV; ;
    return return BASE_LTV BASE_LTV; ;
    } }
    solidity
    Frontend Requirements:
    Display total debt (principal + interest)
    Breakdown: principal vs interest
    Partial repayment input dengan suggestion buttons (25%, 50%, 75%, 100%)
    Confirm dialog sebelum repay
    function function repay repay( (uint256 uint256 amount amount) ) external external { {
    Position Position storage storage pos pos = = positions positions[ [msgmsg. .sender sender] ]; ;
    require require( (pos pos. .borrowedAmount borrowedAmount > > 0 0, , "No active loan" "No active loan") ); ;
            // Update interest // Update interest
            _updateInterest _updateInterest( (msgmsg. .sender sender) ); ;

            uint256 uint256 totalDebt  totalDebt = = pos pos. .borrowedAmount borrowedAmount + + pos pos. .accruedInterest accruedInterest; ;
            require require( (amount amount <=<= totalDebt totalDebt, ,  "Amount exceeds debt" "Amount exceeds debt") ); ;

            // Transfer IDRX from user // Transfer IDRX from user
        IDRX    IDRX. .transferFrom transferFrom( (msgmsg. .sender sender, ,  address address( (this this) ), , amount amount) ); ;

            // Apply payment: interest first, then principal // Apply payment: interest first, then principal
            ifif  ( (amount amount >=>= pos pos. .accruedInterest accruedInterest) )  { {
                    uint256 uint256 principalPayment  principalPayment = = amount  amount -- pos pos. .accruedInterest accruedInterest; ;
            pos        pos. .accruedInterest accruedInterest = =  0 0; ;
            pos        pos. .borrowedAmount borrowedAmount -=-= principalPayment principalPayment; ;
            } }  else else  { {
            pos        pos. .accruedInterest accruedInterest -=-= amount amount; ;
            } }

        pos    pos. .lastInterestUpdate lastInterestUpdate = = block block. .timestamp timestamp; ;

            emit emit  Repaid Repaid( (msgmsg. .sender sender, , amount amount) ); ;
    } }
    function function \_updateInterest \_updateInterest( (address address user user) ) internal internal { {
    Position Position storage storage pos pos = = positions positions[ [user user] ]; ;
            ifif  ( (pos pos. .borrowedAmount borrowedAmount ====  0 0) )  return return; ;

            uint256 uint256 timeElapsed  timeElapsed = = block block. .timestamp timestamp -- pos pos. .lastInterestUpdate lastInterestUpdate; ;
            uint256 uint256 interestAccrued  interestAccrued = =  ( (pos pos. .borrowedAmount borrowedAmount * * ANNUAL_INTEREST_RATE  ANNUAL_INTEREST_RATE * * timeElapsed timeElapsed) )
                                                                  / /  ( (365 365 days  days * *  10000 10000) ); ;

        pos    pos. .accruedInterest accruedInterest +=+= interestAccrued interestAccrued; ;
    } }
14. withdraw(uint256 amount)
    Purpose: Tarik collateral (jika LTV masih sehat)
    Logic:
    Frontend Requirements:
    Show available collateral for withdrawal
    Preview LTV after withdrawal
    Warning jika mendekati max LTV
    solidity
    function function withdraw withdraw( (uint256 uint256 amount amount) ) external external { {
    Position Position storage storage pos pos = = positions positions[ [msgmsg. .sender sender] ]; ;
    require require( (amount amount <=<= pos pos. .collateralAmount collateralAmount, , "Insufficient collateral" "Insufficient collateral") ); ;
            // Update interest // Update interest
            _updateInterest _updateInterest( (msgmsg. .sender sender) ); ;

            // Calculate LTV after withdrawal // Calculate LTV after withdrawal
            uint256 uint256 newCollateral  newCollateral = = pos pos. .collateralAmount collateralAmount -- amount amount; ;
            uint256 uint256 totalDebt  totalDebt = = pos pos. .borrowedAmount borrowedAmount + + pos pos. .accruedInterest accruedInterest; ;

            ifif  ( (totalDebt totalDebt > >  0 0) )  { {
                    uint256 uint256 xautPrice  xautPrice = =  _getXAUTPrice _getXAUTPrice( () ); ;
                    uint256 uint256 newCollateralValueUSD  newCollateralValueUSD = =  ( (newCollateral newCollateral * * xautPrice xautPrice) )  / /  1e18 1e18; ;
                    uint256 uint256 debtValueUSD  debtValueUSD = = totalDebt  totalDebt / /  15384 15384; ;    // Convert IDRX to USD // Convert IDRX to USD

                    uint256 uint256 newLTV  newLTV = =  ( (debtValueUSD debtValueUSD * *  100 100) )  / / newCollateralValueUSD newCollateralValueUSD; ;
                    uint256 uint256 userMaxLTV  userMaxLTV = =  _getUserLTV _getUserLTV( (msgmsg. .sender sender) ); ;

                    require require( (newLTV newLTV <=<= userMaxLTV userMaxLTV, ,  "Withdrawal would exceed max LTV" "Withdrawal would exceed max LTV") ); ;
            } }

        pos    pos. .collateralAmount collateralAmount -=-= amount amount; ;

            // Transfer XAUT to user // Transfer XAUT to user
        XAUT    XAUT. .transfer transfer( (msgmsg. .sender sender, , amount amount) ); ;

            emit emit  Withdrawn Withdrawn( (msgmsg. .sender sender, , amount amount) ); ;
    } }
15. liquidate(address user)
    Purpose: Liquidasi posisi yang tidak sehat
    Logic:
    solidity
    function function liquidate liquidate( (address address user user) ) external external { {
    Position Position storage storage pos pos = = positions positions[ [user user] ]; ;
            // Update interest // Update interest
            _updateInterest _updateInterest( (user user) ); ;

            uint256 uint256 totalDebt  totalDebt = = pos pos. .borrowedAmount borrowedAmount + + pos pos. .accruedInterest accruedInterest; ;
            require require( (totalDebt totalDebt > >  0 0, ,  "No debt to liquidate" "No debt to liquidate") ); ;

            // Check if position is liquidatable // Check if position is liquidatable
            uint256 uint256 currentLTV  currentLTV = =  _getCurrentLTV _getCurrentLTV( (user user) ); ;
            require require( (currentLTV currentLTV >=>= LIQUIDATION_THRESHOLD LIQUIDATION_THRESHOLD, ,  "Position is healthy" "Position is healthy") ); ;

            // Calculate liquidation amounts // Calculate liquidation amounts
            uint256 uint256 collateralToSeize  collateralToSeize = = pos pos. .collateralAmount collateralAmount; ;
            uint256 uint256 debtToCover  debtToCover = = totalDebt totalDebt; ;

            // Apply 1% liquidation penalty (goes to liquidator) // Apply 1% liquidation penalty (goes to liquidator)
            uint256 uint256 penalty  penalty = =  ( (collateralToSeize collateralToSeize * * LIQUIDATION_PENALTY LIQUIDATION_PENALTY) )  / /  100 100; ;
            uint256 uint256 userCollateralReturn  userCollateralReturn = = collateralToSeize  collateralToSeize -- penalty penalty; ;

            // Liquidator pays the debt // Liquidator pays the debt
        IDRX    IDRX. .transferFrom transferFrom( (msgmsg. .sender sender, ,  address address( (this this) ), , debtToCover debtToCover) ); ;

            // Liquidator receives collateral + penalty // Liquidator receives collateral + penalty
        XAUT    XAUT. .transfer transfer( (msgmsg. .sender sender, , collateralToSeize collateralToSeize) ); ;

            // If there's excess collateral after covering debt, return to user // If there's excess collateral after covering debt, return to user
            // (calculate based on debt value vs collateral value) // (calculate based on debt value vs collateral value)
            uint256 uint256 xautPrice  xautPrice = =  _getXAUTPrice _getXAUTPrice( () ); ;
            uint256 uint256 collateralValueUSD  collateralValueUSD = =  ( (collateralToSeize collateralToSeize * * xautPrice xautPrice) )  / /  1e18 1e18; ;
            uint256 uint256 debtValueUSD  debtValueUSD = = debtToCover  debtToCover / /  15384 15384; ;

            ifif  ( (collateralValueUSD collateralValueUSD > > debtValueUSD debtValueUSD) )  { {
                    uint256 uint256 excessValueUSD  excessValueUSD = = collateralValueUSD  collateralValueUSD -- debtValueUSD debtValueUSD; ;
                    uint256 uint256 excessXAUT  excessXAUT = =  ( (excessValueUSD excessValueUSD * *  1e18 1e18) )  / / xautPrice xautPrice; ;

                    // Return excess to user (minus penalty) // Return excess to user (minus penalty)
                    ifif  ( (excessXAUT excessXAUT > > penalty penalty) )  { {
                XAUT            XAUT. .transfer transfer( (user user, , excessXAUT  excessXAUT -- penalty penalty) ); ;
                    } }
            } }

            // Reset position // Reset position
            delete delete positions positions[ [user user] ]; ;


Frontend Requirements:
Public liquidation dashboard (list of liquidatable positions)
Liquidation opportunity calculator (profit estimator untuk liquidator)
User warning system (email/notification jika mendekati liquidation) 6. Helper/View Functions
emit emit Liquidated Liquidated( (user user, , msg msg. .sender sender, , collateralToSeize collateralToSeize, , debtToCover debtToCover) ); ;
} }
function function \_getCurrentLTV \_getCurrentLTV( (address address user user) ) internal internal view view returns returns ( (uint256 uint256) ) { {
Position Position memory memory pos pos = = positions positions[ [user user] ]; ;

        ifif  ( (pos pos. .borrowedAmount borrowedAmount ====  0 0) )  return return  0 0; ;

        uint256 uint256 xautPrice  xautPrice = =  _getXAUTPrice _getXAUTPrice( () ); ;
        uint256 uint256 collateralValueUSD  collateralValueUSD = =  ( (pos pos. .collateralAmount collateralAmount * * xautPrice xautPrice) )  / /  1e18 1e18; ;

        // Include accrued interest in debt calculation // Include accrued interest in debt calculation
        uint256 uint256 timeElapsed  timeElapsed = = block block. .timestamp timestamp -- pos pos. .lastInterestUpdate lastInterestUpdate; ;
        uint256 uint256 pendingInterest  pendingInterest = =  ( (pos pos. .borrowedAmount borrowedAmount * * ANNUAL_INTEREST_RATE  ANNUAL_INTEREST_RATE * * timeElapsed timeElapsed) )
                                                              / /  ( (365 365 days  days * *  10000 10000) ); ;
        uint256 uint256 totalDebt  totalDebt = = pos pos. .borrowedAmount borrowedAmount + + pos pos. .accruedInterest accruedInterest + + pendingInterest pendingInterest; ;
        uint256 uint256 debtValueUSD  debtValueUSD = = totalDebt  totalDebt / /  15384 15384; ;

        return return  ( (debtValueUSD debtValueUSD * *  100 100) )  / / collateralValueUSD collateralValueUSD; ;

} }
solidity
// Get user position details // Get user position details
function function getPosition getPosition( (address address user user) ) external external view view returns returns ( (
uint256 uint256 collateralAmount collateralAmount, ,
uint256 uint256 borrowedAmount borrowedAmount, ,
uint256 uint256 accruedInterest accruedInterest, ,
uint256 uint256 currentLTV currentLTV, ,
uint256 uint256 maxLTV maxLTV, ,
uint256 uint256 liquidationThreshold liquidationThreshold, ,
uint256 uint256 healthFactor healthFactor
) ) { {
Position Position memory memory pos pos = = positions positions[ [user user] ]; ;

    collateralAmount     collateralAmount = = pos pos. .collateralAmount collateralAmount; ;
    borrowedAmount     borrowedAmount = = pos pos. .borrowedAmount borrowedAmount; ;

        // Calculate pending interest // Calculate pending interest
        ifif  ( (pos pos. .borrowedAmount borrowedAmount > >  0 0) )  { {
                uint256 uint256 timeElapsed  timeElapsed = = block block. .timestamp timestamp -- pos pos. .lastInterestUpdate lastInterestUpdate; ;
                uint256 uint256 pendingInterest  pendingInterest = =  ( (pos pos. .borrowedAmount borrowedAmount * * ANNUAL_INTEREST_RATE  ANNUAL_INTEREST_RATE * * timeElapsed timeElapsed) )
                                                                      / /  ( (365 365 days  days * *  10000 10000) ); ;
        accruedInterest         accruedInterest = = pos pos. .accruedInterest accruedInterest + + pendingInterest pendingInterest; ;
        } }  else else  { {
        accruedInterest         accruedInterest = =  0 0; ;
        } }

    currentLTV     currentLTV = =  _getCurrentLTV _getCurrentLTV( (user user) ); ;
    maxLTV     maxLTV = =  _getUserLTV _getUserLTV( (user user) ); ;
    liquidationThreshold     liquidationThreshold = = LIQUIDATION_THRESHOLD LIQUIDATION_THRESHOLD; ;

        // Health Factor = (Liquidation Threshold / Current LTV) // Health Factor = (Liquidation Threshold / Current LTV)
        // > 1 = healthy, < 1 = liquidatable // > 1 = healthy, < 1 = liquidatable
        ifif  ( (currentLTV currentLTV > >  0 0) )  { {
        healthFactor         healthFactor = =  ( (liquidationThreshold liquidationThreshold * *  1e18 1e18) )  / / currentLTV currentLTV; ;
        } }  else else  { {
        healthFactor         healthFactor = =  type type( (uint256 uint256) ). .maxmax; ;    // Infinite health (no debt) // Infinite health (no debt)
        } }

} }
// Get XAUT price from Chainlink // Get XAUT price from Chainlink
function function \_getXAUTPrice \_getXAUTPrice( () ) internal internal view view returns returns ( (uint256 uint256) ) { {
( (
uint80 uint80 roundId roundId, ,
int256 int256 answer answer, ,
uint256 uint256 startedAt startedAt, ,
uint256 uint256 updatedAt updatedAt, ,
uint80 uint80 answeredInRound answeredInRound
👤
User Stories & Flows
User Story 1: First-Time Borrower (Emergency Cash Need)
As a digital gold holder in Indonesia
I want to get instant cash without selling my XAUT
So that I can cover emergency expenses while keeping my long-term investment
Acceptance Criteria:
User can connect wallet in < 10 seconds
User can see borrowing capacity immediately after connecting
Entire flow from deposit to receiving IDRX takes < 2 minutes
User receives clear explanation of interest rate and repayment terms
User Flow:
) ) = = xautUsdPriceFeed xautUsdPriceFeed. .latestRoundData latestRoundData( () ); ;

        require require( (answer answer > >  0 0, ,  "Invalid price" "Invalid price") ); ;
        require require( (updatedAt updatedAt > > block block. .timestamp timestamp --  1 1 hours hours, ,  "Stale price" "Stale price") ); ;

        return return  uint256 uint256( (answer answer) ); ;    // Returns price with 8 decimals // Returns price with 8 decimals

} }
// Calculate max borrowable amount for user // Calculate max borrowable amount for user
function function getMaxBorrowAmount getMaxBorrowAmount( (address address user user) ) external external view view returns returns ( (uint256 uint256) ) { {
return return \_calculateMaxBorrow \_calculateMaxBorrow( (user user) ); ;
} }
// Check if position is liquidatable // Check if position is liquidatable
function function isLiquidatable isLiquidatable( (address address user user) ) external external view view returns returns ( (bool bool) ) { {
uint256 uint256 currentLTV currentLTV = = \_getCurrentLTV \_getCurrentLTV( (user user) ); ;
return return currentLTV currentLTV >=>= LIQUIDATION_THRESHOLD LIQUIDATION_THRESHOLD; ;
} }

1.  Landing Page
1.  Landing Page
    ↓
    ↓
1.  Connect Wallet (RainbowKit)
1.  Connect Wallet (RainbowKit)
    ↓
    ↓
1.  Dashboard (shows "No collateral yet")
1.  Dashboard (shows "No collateral yet")
    ↓
    ↓
1.  Click "Deposit XAUT"
1.  Click "Deposit XAUT"
    ↓
1.  Enter amount → See borrowing capacity preview
    ↓
1.  Enter amount → See borrowing capacity preview
    ↓
    ↓
1.  Approve XAUT → Confirm Deposit (2 transactions)
    ↓
1.  Approve XAUT → Confirm Deposit (2 transactions)
    ↓
1.  Navigate to "Borrow" tab
1.  Navigate to "Borrow" tab
    ↓
    ↓
1.  Enter IDRX amount (slider shows max limit)
1.  Enter IDRX amount (slider shows max limit)
    ↓
    ↓
1.  Review terms (LTV, interest, liquidation risk)
1.  Review terms (LTV, interest, liquidation risk)
    ↓
1.  Confirm Borrow → Receive IDRX instantly
    ↓
    ↓
1.  Confirm Borrow → Receive IDRX instantly
    ↓
1.  Dashboard now shows active loan with health factor
1.  Dashboard now shows active loan with health factor
    Screen Requirements:
    Landing: Hero section dengan "Cash out your needs, keep your gold" tagline
    Deposit Modal: XAUT balance, input field, max button, gas estimate
    Borrow Modal: Slider, LTV indicator, health meter, terms checkbox
    Dashboard: Collateral value, borrowed amount, health factor (color-coded)
    User Story 2: Loan Management (Partial Repayment)
    As a borrower with active loan
    I want to make partial repayments flexibly
    So that I can improve my health factor without paying all at once
    Acceptance Criteria:
    User can see exact breakdown: principal vs interest
    Partial payment applies to interest first, then principal
    Health factor updates in real-time after repayment
    User can withdraw excess collateral after improving LTV
    User Flow:
1.  Dashboard → Shows current debt: 10,000 IDRX- Principal: 9,500 IDRX
1.  Dashboard → Shows current debt: 10,000 IDRX- Principal: 9,500 IDRX- Interest: 500 IDRX- Interest: 500 IDRX
    ↓
    ↓
1.  Click "Repay" button
1.  Click "Repay" button
    ↓
    ↓
1.  Repay Modal shows:
1.  Repay Modal shows:- Quick actions: 25% | 50% | 75% | 100%- Quick actions: 25% | 50% | 75% | 100%- Custom input field- Preview: "After repaying 5,000 IDRX, your health factor: 1.2 → 1.5"- Custom input field- Preview: "After repaying 5,000 IDRX, your health factor: 1.2 → 1.5"
    ↓
    ↓
1.  Select 50% → Amount auto-fills to 5,000 IDRX
1.  Select 50% → Amount auto-fills to 5,000 IDRX
    ↓
    ↓
1.  Approve IDRX → Confirm Repayment
    ↓
1.  Approve IDRX → Confirm Repayment
    ↓
1.  Success: "You repaid 500 IDRX interest + 4,500 IDRX principal"
1.  Success: "You repaid 500 IDRX interest + 4,500 IDRX principal"
    ↓
    ↓
1.  Dashboard updates:
1.  Dashboard updates:- Remaining debt: 5,000 IDRX (principal only)- Remaining debt: 5,000 IDRX (principal only)- Health factor: 1.5 (improved, green color)- Health factor: 1.5 (improved, green color)
    User Story 3: Liquidation Scenario (Unhealthy Position)
    As a borrower whose XAUT price dropped
    I want to be warned before liquidation
    So that I can add collateral or repay to avoid liquidation
    Acceptance Criteria:
    Warning notification when health factor < 1.2
    Critical alert when health factor < 1.05
    Clear explanation of liquidation consequences
    Option to add collateral or repay debt immediately
    User Flow:
    If user doesn't act:
1.  XAUT price drops from $2,400 → $2,100 (12.5% drop) 1. XAUT price drops from $2,400 → $2,100 (12.5% drop)
    ↓ ↓
1.  User's position: 2. User's position:
    - Collateral: 1 XAUT ($2,100)- Collateral: 1 XAUT ($2,100)
    - Borrowed: 1,200 IDRX (~$80)- Borrowed: 1,200 IDRX (~$80)
    - Current LTV: 76% (was 67%)- Current LTV: 76% (was 67%)
    - Health factor: 1.05 (liquidation at 80% LTV)- Health factor: 1.05 (liquidation at 80% LTV)
      ↓ ↓
1.  Dashboard shows CRITICAL WARNING banner: 3. Dashboard shows CRITICAL WARNING banner:
    "⚠
    Your position is close to liquidation! Add collateral or repay now." "⚠
    Your position is close to liquidation! Add collateral or repay now."
    ↓ ↓
1.  User has 2 options: 4. User has 2 options:
          OPTION A: Add Collateral OPTION A: Add Collateral
          - Deposit 0.2 XAUT more- Deposit 0.2 XAUT more
          - New LTV: 63%- New LTV: 63%
          - Health factor: 1.27
    ✓- Health factor: 1.27
    ✓
          OPTION B: Repay Debt OPTION B: Repay Debt
          - Repay 400 IDRX- Repay 400 IDRX
          - New LTV: 63%- New LTV: 63%
          - Health factor: 1.27
    ✓- Health factor: 1.27
    ✓
    ↓ ↓
1.  User chooses Option A → Deposits 0.2 XAUT 5. User chooses Option A → Deposits 0.2 XAUT
    ↓ ↓
1.  Success: "Position secured. Health factor: 1.27" 6. Success: "Position secured. Health factor: 1.27"
1.  Price continues to drop → XAUT = $1,950 7. Price continues to drop → XAUT = $1,950
    ↓ ↓
1.  Current LTV: 82% (exceeds 80% threshold) 8. Current LTV: 82% (exceeds 80% threshold)
    ↓ ↓
1.  Liquidation bot calls liquidate(userAddress) 9. Liquidation bot calls liquidate(userAddress)
    ↓ ↓
1.  Liquidation executed: 10. Liquidation executed: - Bot pays 1,200 IDRX debt- Bot pays 1,200 IDRX debt - Bot receives 1.2 XAUT ($2,340 worth)- Bot receives 1.2 XAUT ($2,340 worth) - Profit: $2,340 - $80 = $2,260- Profit: $2,340 - $80 = $2,260 - User loses collateral (but debt is cleared)- User loses collateral (but debt is cleared)
    ↓ ↓
1.  User dashboard shows: "Your position was liquidated on [date]" 11. User dashboard shows: "Your position was liquidated on [date]"
    User Story 4: Liquidator (Profit Opportunity)
    As a liquidation bot operator
    I want to find and liquidate unhealthy positions profitably
    So that I can earn liquidation bonuses while keeping protocol solvent
    Acceptance Criteria:
    Public API/subgraph to query liquidatable positions
    Liquidation function callable by anyone
    Clear profit calculation before execution
    Gas costs considered in profitability check
    User Flow:
1.  Bot queries AuRoomVault.isLiquidatable(address) for all users
1.  Bot queries AuRoomVault.isLiquidatable(address) for all users
    ↓
    ↓
1.  Found liquidatable position:
1.  Found liquidatable position:- User: 0x1234...- User: 0x1234...- Collateral: 1.5 XAUT ($2,850 at $1,900/XAUT)- Collateral: 1.5 XAUT ($2,850 at $1,900/XAUT)- Debt: 1,500 IDRX (~$100)- Debt: 1,500 IDRX (~$100)- Current LTV: 83%- Current LTV: 83%
    ↓
    ↓
1.  Bot calculates profit:
1.  Bot calculates profit:- Pay: 1,500 IDRX ($100)- Pay: 1,500 IDRX ($100)- Receive: 1.5 XAUT ($2,850)- Receive: 1.5 XAUT ($2,850)- Liquidation penalty (1%): 0.015 XAUT (~$28.50)- Liquidation penalty (1%): 0.015 XAUT (~$28.50)- Gross profit: $2,850 - $100 = $2,750- Gross profit: $2,850 - $100 = $2,750- User gets back excess collateral minus penalty- User gets back excess collateral minus penalty
    ↓
    ↓
1.  Bot approves 1,500 IDRX to contract
1.  Bot approves 1,500 IDRX to contract
    ↓
    ↓
1.  Bot calls liquidate(0x1234...)
1.  Bot calls liquidate(0x1234...)
    ↓
    ↓
1.  Transaction succeeds:
1.  Transaction succeeds:- Contract burns/collects 1,500 IDRX
    ↓
    ↓- Contract burns/collects 1,500 IDRX- Bot receives 1.5 XAUT- Bot receives 1.5 XAUT- User receives excess collateral (if any) minus penalty- User receives excess collateral (if any) minus penalty
1.  Position deleted from state
1.  Position deleted from state
    Note: Actual implementation might use flash loans to eliminate capital requirements for liquidators.
    �
    �
    Frontend Requirements
    Design Principles
1.
1.
1.
1.  Mobile-First: 60%+ crypto users di Indonesia mobile-first
    Minimal Clicks: Max 3 clicks untuk core actions
    Clear Feedback: Loading states, success/error messages
    Educational: Inline tooltips untuk DeFi terms
    Page Structure
1.  Landing Page (
    Components:
    / )
    Hero section dengan tagline
    "How it works" (4 steps visual)
    Stats ticker (TVL, total borrowed, active loans)
    CTA: "Launch App"
    Design Notes:
    Background: Gradient (gold theme)
    Illustrations: Gold bars, safe, cash
    Mobile: Stack components vertically
1.  Dashboard (
    /app )
    Layout:
    State Variants:
    A. No Collateral (First Visit):
    ┌─────────────────────────────────────────────────────┐ ┌─────────────────────────────────────────────────────┐
    │ Header: Logo | Connect Wallet | Network: Base │ │ Header: Logo | Connect Wallet | Network: Base │
    ├─────────────────────────────────────────────────────┤ ├─────────────────────────────────────────────────────┤
    │ │ │ │
    │ ┌───────────────┐ ┌───────────────┐ │ │ ┌───────────────┐ ┌───────────────┐ │
    │ │ Collateral │ │ Borrowed │ │ │ │ Collateral │ │ Borrowed │ │
    │ │ 1.5 XAUT │ │ 1,200 IDRX │ │ │ │ 1.5 XAUT │ │ 1,200 IDRX │ │
    │ │ ≈ $2,850 │ │ ≈ Rp 1,8 jt │ │ │ │ ≈ $2,850 │ │ ≈ Rp 1,8 jt │ │
    │ └───────────────┘ └───────────────┘ │ │ └───────────────┘ └───────────────┘ │
    │ │ │ │
    │ ┌─────────────────────────────────────────────┐ │ │ ┌─────────────────────────────────────────────┐ │
    │ │ Health Factor: 1.35 │ │ │ │ Health Factor: 1.35 │ │
    │ │ ████████████░░░░░░ (Safe) │ │ │ │ ████████████░░░░░░ (Safe) │ │
    │ │ │ │ │ │ │ │
    │ │ Current LTV: 67% / Max LTV: 70% │ │ │ │ Current LTV: 67% / Max LTV: 70% │ │
    │ │ Liquidation at: 80% │ │ │ │ Liquidation at: 80% │ │
    │ └─────────────────────────────────────────────┘ │ │ └─────────────────────────────────────────────┘ │
    │ │ │ │
    │ [Deposit] [Borrow] [Repay] [Withdraw] │ │ [Deposit] [Borrow] [Repay] [Withdraw] │
    │ │ │ │
    │ ┌─────────────────────────────────────────────┐ │ │ ┌─────────────────────────────────────────────┐ │
    │ │ Loan Details │ │ │ │ Loan Details │ │
    │ │ Principal: 1,150 IDRX │ │ │ │ Principal: 1,150 IDRX │ │
    │ │ Interest: 50 IDRX (5% APR) │ │ │ │ Interest: 50 IDRX (5% APR) │ │
    │ │ Total Debt: 1,200 IDRX │ │ │ │ Total Debt: 1,200 IDRX │ │
    │ │ │ │ │ │ │ │
    │ │ [View Transactions] │ │ │ │ [View Transactions] │ │
    │ └─────────────────────────────────────────────┘ │ │ └─────────────────────────────────────────────┘ │
    └─────────────────────────────────────────────────────┘ └─────────────────────────────────────────────────────┘
    │ Welcome to AuRoom!  
    ┌─────────────────────────────────────────────────┐
    │ Welcome to AuRoom!  
    ┌─────────────────────────────────────────────────┐
    │
    │
    │  
    │  
    │
    │ You haven't deposited any collateral yet.  
    │
    │ You haven't deposited any collateral yet.  
    │  
    │  
    │
    │ [Deposit XAUT to Get Started]  
    │
    │ [Deposit XAUT to Get Started]  
    │  
    │  
    │ How it works:  
    │ How it works:  
    │
    │ 1. Deposit XAUT (gold-backed token)  
    │
    │ 1. Deposit XAUT (gold-backed token)  
    │ 2. Borrow IDRX instantly  
    │ 2. Borrow IDRX instantly  
    │ 3. Repay anytime, no early penalty  
    │ 3. Repay anytime, no early penalty  
    │ 4. Withdraw your gold when loan is paid  
    │ 4. Withdraw your gold when loan is paid  
    │
    │
    │
    │
    │
    │
    │
    │
    │
    │
    │
    │
    │
    │
    └─────────────────────────────────────────────────┘
    └─────────────────────────────────────────────────┘
    B. Has Collateral, No Loan:
    │ Collateral: 1.5 XAUT ($2,850)  
    ┌─────────────────────────────────────────────────┐
    │ Collateral: 1.5 XAUT ($2,850)  
    ┌─────────────────────────────────────────────────┐
    │
    │
    │ Borrowed: 0 IDRX  
    │ Borrowed: 0 IDRX  
    │  
    │  
    │
    │
    │
    │ Available to borrow: Up to 21,000,000 IDRX  
    │
    │ Available to borrow: Up to 21,000,000 IDRX  
    │
    │
    │  
    │  
     (≈ Rp 1,995,000)  
     (≈ Rp 1,995,000)  
    │
    │
    │
    │ [Borrow Now] [Withdraw Collateral]  
    │
    │ [Borrow Now] [Withdraw Collateral]  
    │
    │
    │
    │
    └─────────────────────────────────────────────────┘
    └─────────────────────────────────────────────────┘
    C. Active Loan (Healthy):
    Health factor: Green (> 1.2)
    All buttons enabled
    D. Warning State:
    Health factor: Yellow (1.05 - 1.2)
    Banner: "⚠
    Add collateral or repay to avoid liquidation"
    E. Critical State:
    Health factor: Red (< 1.05)
    Banner: "🚨
    URGENT: Position will be liquidated soon!"
    Only "Deposit" and "Repay" buttons highlighted
1.  Deposit Modal
    Fields:
    XAUT balance display
    Amount input (with max button)
    Preview: "You can borrow up to X IDRX"
    Validation:
    Amount > 0
    Amount ≤ wallet balance
    Gas estimate shown
    Transactions:
1.
1.  Approve XAUT (if not approved)
    Deposit XAUT
    Loading State:
    Step 1/2: Approving XAUT...
    Step 1/2: Approving XAUT...
    [Progress spinner]
    [Progress spinner]
    Step 2/2: Depositing collateral...
    Step 2/2: Depositing collateral...
    [Progress spinner]
    [Progress spinner]
1.  Borrow Modal
    Fields:
    Available to borrow (max amount)
    IDRX amount input
    Slider (0% - 100% of max)
    Real-time Calculations:
    │ Borrowing: 1,200 IDRX  
    ┌─────────────────────────────────────────────────┐
    │ Borrowing: 1,200 IDRX  
    ┌─────────────────────────────────────────────────┐
    │
    │
    │ ━━━━━━━━━━━━━━━━░░░░ (60% of max)  
    │ ━━━━━━━━━━━━━━━━░░░░ (60% of max)  
    │  
    │  
    │ After Borrowing:  
    │ After Borrowing:  
    │ • LTV: 42% → 67%  
    │ • LTV: 42% → 67%  
    │ • Health Factor: ∞ → 1.19  
    │ • Health Factor: ∞ → 1.19  
    │ • Interest Rate: 5% APR  
    │ • Interest Rate: 5% APR  
    │
    │
    │
    │
    │
    │
    │
    │
    │
    │ • Estimated Interest (30 days): ~5 IDRX  
    │
    │ • Estimated Interest (30 days): ~5 IDRX  
    │  
    │  
    │
    │
    │
    │
    │ ⚠
    You can be liquidated if LTV reaches 80% │
    │ ⚠
    You can be liquidated if LTV reaches 80% │
    │  
    │  
    │ [Cancel] [Confirm Borrow]  
    │ [Cancel] [Confirm Borrow]  
    │
    │
    │
    │
    │
    │
    └─────────────────────────────────────────────────┘
    └─────────────────────────────────────────────────┘
    Validation:
    Amount > 0
    Amount ≤ max borrowable
    Warning if resulting LTV > 65%
1.  Repay Modal
    Fields:
    Total debt display (principal + interest breakdown)
    Amount input
    Quick action buttons
    Layout:
    │ Total Debt: 1,200 IDRX  
    ┌─────────────────────────────────────────────────┐
    │ Total Debt: 1,200 IDRX  
    ┌─────────────────────────────────────────────────┐
    │
    │
    │ • Principal: 1,150 IDRX  
    │ • Principal: 1,150 IDRX  
    │ • Interest: 50 IDRX  
    │ • Interest: 50 IDRX  
    │  
    │  
    │ Repay Amount:  
    │ Repay Amount:  
    │ [____________________] IDRX  
    │ [____________________] IDRX  
    │  
    │  
    │
    │ [25%] [50%] [75%] [100%]  
    │
    │ [25%] [50%] [75%] [100%]  
    │  
    │  
    │ After Repayment:  
    │ After Repayment:  
    │ • Remaining Debt: 600 IDRX  
    │ • Remaining Debt: 600 IDRX  
    │ • LTV: 67% → 42%  
    │ • LTV: 67% → 42%  
    │ • Health Factor: 1.19 → 1.90  
    │ • Health Factor: 1.19 → 1.90  
    │  
    │  
    │
    │
    │
    │
    │
    │
    │
    │
    │
    │
    │
    │
    │
    │
    │
    │
    │
    │
    │
    │
    │
    │
    │
    │
    │ 💡
    Tip: Pay interest first to minimize costs │
    │  
    │ 💡
    Tip: Pay interest first to minimize costs │
    │  
    │
    │ [Cancel] [Confirm Repayment]  
    │
    │ [Cancel] [Confirm Repayment]  
    │
    │
    └─────────────────────────────────────────────────┘
    └─────────────────────────────────────────────────┘
    Payment Priority Logic:
    If repayAmount >= accruedInterest:
    If repayAmount >= accruedInterest:
    Pay all interest first
    Pay all interest first
    Remaining amount goes to principal
    Remaining amount goes to principal
    Else:
    Else:
    Pay partial interest only
    Pay partial interest only
1.  Withdraw Modal
    Fields:
    Total collateral
    Available to withdraw (based on LTV constraint)
    Amount input
    Validation:
    If (has active loan):
    If (has active loan):
    maxWithdrawable = collateral - (debt / maxLTV)
    maxWithdrawable = collateral - (debt / maxLTV)
    If withdrawAmount > maxWithdrawable:
    If withdrawAmount > maxWithdrawable:
    Error: "Withdrawal would make position unhealthy"
    Error: "Withdrawal would make position unhealthy"
    Suggestion: "Repay X IDRX to withdraw this amount"
    Suggestion: "Repay X IDRX to withdraw this amount"
    Else:
    Else:
    Can withdraw all collateral
    Can withdraw all collateral
    Layout:
    │ Total Collateral: 1.5 XAUT  
    ┌─────────────────────────────────────────────────┐
    │ Total Collateral: 1.5 XAUT  
    ┌─────────────────────────────────────────────────┐
    │
    │
    │ Available to Withdraw: 0.3 XAUT  
    │ Available to Withdraw: 0.3 XAUT  
    │ (Locked by active loan: 1.2 XAUT)  
    │ (Locked by active loan: 1.2 XAUT)  
    │  
    │  
    │ Withdraw Amount:  
    │ Withdraw Amount:  
    │
    │
    │ [____________________] XAUT  
    │ [____________________] XAUT  
    │  
    │  
    │ After Withdrawal:  
    │ After Withdrawal:  
    │ • Remaining Collateral: 1.2 XAUT  
    │ • Remaining Collateral: 1.2 XAUT  
    │ • LTV: 67% (unchanged, at max)  
    │ • LTV: 67% (unchanged, at max)  
    │ • Health Factor: 1.19 (unchanged)  
    │ • Health Factor: 1.19 (unchanged)  
    │  
    │  
    │
    │ [Cancel] [Confirm Withdrawal]  
    │
    │ [Cancel] [Confirm Withdrawal]  
    │
    │
    │
    │
    │
    │
    │
    │
    │
    │
    │
    │
    │
    │
    │
    │
    │
    │
    │
    │
    └─────────────────────────────────────────────────┘
    └─────────────────────────────────────────────────┘
1.  Liquidation Dashboard (
    /liquidate )
    Purpose: Public page untuk liquidators
    Components:
    List of liquidatable positions (table)
    Profit calculator
    One-click liquidate button
    Table Columns:
    | Address | Collateral | Debt | LTV | Est. Profit | Action |
    | Address | Collateral | Debt | LTV | Est. Profit | Action |
    |----------|-----------|---------|------|-------------|-------------|
    |----------|-----------|---------|------|-------------|-------------|
    | 0x1234.. | 1.5 XAUT | 1,500₹ | 83% | ~$2,750 | [Liquidate] |
    | 0x1234.. | 1.5 XAUT | 1,500₹ | 83% | ~$2,750 | [Liquidate] |
    | 0x5678.. | 2.0 XAUT | 2,000₹ | 81% | ~$3,600 | [Liquidate] |
    | 0x5678.. | 2.0 XAUT | 2,000₹ | 81% | ~$3,600 | [Liquidate] |
    Profit Calculation Tooltip:
    Profit = (Collateral Value) - (Debt to Cover) - (Gas Costs)
    Profit = (Collateral Value) - (Debt to Cover) - (Gas Costs)
    Penalty (1%) goes to liquidator as bonus
    Penalty (1%) goes to liquidator as bonus
    Component Library (shadcn/ui)
    Install:
    bash
    npx shadcn-ui@latest init
    npx shadcn-ui@latest init
    npx shadcn-ui@latest
    npx shadcn-ui@latest add
    add button card input slider dialog alert
    button card input slider dialog alert
    Custom Components:
1.
1.
1.
1.
1.  HealthFactorMeter.tsx
    Visual indicator (progress bar)
    Color: Green (>1.2), Yellow (1.05-1.2), Red (<1.05)
    LTVSlider.tsx
    Custom slider dengan zone markers
    Shows safe zone, warning zone, danger zone
    TransactionStepper.tsx
    Multi-step transaction progress
    Shows current step, completed steps, pending steps
    CollateralCard.tsx
    Reusable card untuk display collateral info
    WalletButton.tsx
    RainbowKit integration wrapper
    State Management (Zustand)
    Store Structure:
    typescript
    Wagmi Hooks Usage
    Key Hooks:
    // store/useAuRoomStore.ts // store/useAuRoomStore.ts
    interface interface AuRoomStore AuRoomStore { {
    // User position // User position
    position position: : { {
    collateralAmount collateralAmount: : bigint bigint; ;
    borrowedAmount borrowedAmount: : bigint bigint; ;
    accruedInterest accruedInterest: : bigint bigint; ;
    currentLTV currentLTV: : number number; ;
    healthFactor healthFactor: : number number; ;
    } } | | null null; ;
        // UI state // UI state
    isDepositModalOpen isDepositModalOpen: : boolean boolean; ;
    isBorrowModalOpen isBorrowModalOpen: : boolean boolean; ;
    isRepayModalOpen isRepayModalOpen: : boolean boolean; ;
    isWithdrawModalOpen isWithdrawModalOpen: : boolean boolean; ;
        // Loading states // Loading states
    isLoadingPosition isLoadingPosition: : boolean boolean; ;
        // Actions // Actions
        setPosition setPosition: :  ( (position position: :  Position Position) )  =>=>  void void; ;
        openDepositModal openDepositModal: :  ( () )  =>=>  void void; ;
        closeDepositModal closeDepositModal: :  ( () )  =>=>  void void; ;
        // ... other modal actions // ... other modal actions
    } }
    typescript
    Real-time Price Updates:
    🔗
    Integration Points
1.  Chainlink Price Feed
    Contract Address (Base Sepolia):
    // Read user position // Read user position
    const const { { data data: : position position } } = = useReadContract useReadContract( ({ {
    address address: : AUROOM_VAULT_ADDRESS AUROOM_VAULT_ADDRESS, ,
    abi abi: : AuRoomVaultABI AuRoomVaultABI, ,
    functionName functionName: : 'getPosition' 'getPosition', ,
    args args: : [ [address address] ], ,
    watch watch: : true true, , // Real-time updates // Real-time updates
    } }) ); ;
    // Write: Deposit // Write: Deposit
    const const { { writeContract writeContract: : deposit deposit } } = = useWriteContract useWriteContract( () ); ;
    // Simulate before write // Simulate before write
    const const { { data data: : simulateData simulateData } } = = useSimulateContract useSimulateContract( ({ {
    address address: : AUROOM_VAULT_ADDRESS AUROOM_VAULT_ADDRESS, ,
    abi abi: : AuRoomVaultABI AuRoomVaultABI, ,
    functionName functionName: : 'deposit' 'deposit', ,
    args args: : [ [depositAmount depositAmount] ], ,
    } }) ); ;
    // Wait for transaction // Wait for transaction
    const const { { isLoading isLoading, , isSuccess isSuccess } } = = useWaitForTransactionReceipt useWaitForTransactionReceipt( ({ {
    hash hash: : depositTxHash depositTxHash, ,
    } }) ); ;
    typescript
    // Poll Chainlink price feed every 10 seconds // Poll Chainlink price feed every 10 seconds
    const const { { data data: : xautPrice xautPrice } } = = useReadContract useReadContract( ({ {
    address address: : CHAINLINK_XAUT_USD_FEED CHAINLINK_XAUT_USD_FEED, ,
    abi abi: : AggregatorV3Interface AggregatorV3Interface, ,
    functionName functionName: : 'latestRoundData' 'latestRoundData', ,
    query query: : { {
    refetchInterval refetchInterval: : 10_000 10_000, , // 10 seconds // 10 seconds
    } }, ,
    } }) ); ;
    XAUT/USD:
    TBD (need to verify on Chainlink Data Feeds)
    Fallback: Use Base mainnet feed for testing
    Integration:
    solidity
    import
    import "@chainlink/contracts/src/v0.8/interfaces/AggregatorV3Interface.sol"
    "@chainlink/contracts/src/v0.8/interfaces/AggregatorV3Interface.sol"; ;
    AggregatorV3Interface
    AggregatorV3Interface public
    public xautUsdPriceFeed
    xautUsdPriceFeed; ;
    constructor( (address
    constructor
    xautUsdPriceFeed =
    address \_xautUsdFeed
    \_xautUsdFeed) ) { {
    xautUsdPriceFeed
    = AggregatorV3Interface
    AggregatorV3Interface( (\_xautUsdFeed
    }
    }
    function \_getXAUTPrice
    function
    (
    \_getXAUTPrice( () ) internal
    (, , int256
    int256 answer
    internal view
    answer, , , , uint256
    uint256 updatedAt
    updatedAt, , ) ) =
    xautUsdPriceFeed
    xautUsdPriceFeed. .latestRoundData
    latestRoundData( () ); ;
    require
    require
    require( (answer
    answer > > 0 0, , "Invalid price"
    require( (updatedAt
    "Invalid price") ); ;
    updatedAt > > block
    return
    return uint256
    }
    }
    \_xautUsdFeed) ); ;
    view returns
    returns ( (uint256
    uint256) ) { {
    =  
     block. .timestamp
    timestamp -- 1 1 hours
    hours, , "Stale price"
    "Stale price") ); ;
    uint256( (answer
    answer) ); ; // 8 decimals
    // 8 decimals
    Error Handling:
    Price < 0: Revert with "Invalid price"
    Updated > 1 hour ago: Revert with "Stale price"
    Feed unavailable: Pause borrowing (emergency mode)
1.  XAUT Token
    Contract: XAUT is Tether Gold (ERC-20)
    Address: Use wrapped version atau mock for testnet
    Decimals: 18
    Frontend Integration:
    typescript
1.  IDRX Token
    Contract: IDRX (Indonesian Rupiah stablecoin)
    Status: TBD - need to verify if exists on Base Sepolia
    Alternative: Use mock ERC-20 for hackathon
    Decimals: 6 (consistent with fiat)
    Peg: 1 IDRX = 1 IDR
    Mock Contract (if needed):
    // Check XAUT balance // Check XAUT balance
    const const { { data data: : xautBalance xautBalance } } = = useReadContract useReadContract( ({ {
    address address: : XAUT_ADDRESS XAUT_ADDRESS, ,
    abi abi: : erc20ABI erc20ABI, ,
    functionName functionName: : 'balanceOf' 'balanceOf', ,
    args args: : [ [userAddress userAddress] ], ,
    } }) ); ;
    // Check allowance // Check allowance
    const const { { data data: : allowance allowance } } = = useReadContract useReadContract( ({ {
    address address: : XAUT_ADDRESS XAUT_ADDRESS, ,
    abi abi: : erc20ABI erc20ABI, ,
    functionName functionName: : 'allowance' 'allowance', ,
    args args: : [ [userAddress userAddress, , AUROOM_VAULT_ADDRESS AUROOM_VAULT_ADDRESS] ], ,
    } }) ); ;
    // Approve // Approve
    const const { { writeContract writeContract: : approveXAUT approveXAUT } } = = useWriteContract useWriteContract( () ); ;
    approveXAUT approveXAUT( ({ {
    address address: : XAUT_ADDRESS XAUT_ADDRESS, ,
    abi abi: : erc20ABI erc20ABI, ,
    functionName functionName: : 'approve' 'approve', ,
    args args: : [ [AUROOM_VAULT_ADDRESS AUROOM_VAULT_ADDRESS, , MAX_UINT256 MAX_UINT256] ], ,
    } }) ); ;
    solidity
    Conversion Logic:
1.  Wallet Integration (RainbowKit)
    Setup:
    // MockIDRX.sol // MockIDRX.sol
    contract contract MockIDRX MockIDRX isis ERC20 ERC20 { {
    constructor constructor( () ) ERC20 ERC20( ("Indonesian Rupiah" "Indonesian Rupiah", , "IDRX" "IDRX") ) { {
    \_mint \_mint( (msgmsg. .sender sender, , 1 1_000_000_000 \_000_000_000 \* \* 1010\*\*\*\*6 6) ); ; // 1B IDRX // 1B IDRX
    } }
            function function  decimals decimals( () )  public public  pure pure override  override returns returns  ( (uint8 uint8) )  { {
                    return return  6 6; ;
            } }

            // Faucet for testing // Faucet for testing
            function function  faucet faucet( () )  external external  { {
                    _mint _mint( (msgmsg. .sender sender, ,  100 100_000 _000 * *  1010****6 6) ); ;  // 100k IDRX // 100k IDRX
            } }
    } }
    typescript
    // USD to IDRX (assuming 1 USD = 15,384 IDRX) // USD to IDRX (assuming 1 USD = 15,384 IDRX)
    const const USD_TO_IDRX_RATE USD_TO_IDRX_RATE = = 15384 15384; ;
    function function usdToIDRX usdToIDRX( (usdAmount usdAmount: : bigint bigint) ): : bigint bigint { {
    return return usdAmount usdAmount \* \* BigInt BigInt( (USD_TO_IDRX_RATE USD_TO_IDRX_RATE) ); ;
    } }
    // Display formatting // Display formatting
    function function formatIDRX formatIDRX( (amount amount: : bigint bigint) ): : string string { {
    const const formatted formatted = = Number Number( (amount amount) ) / / 1e61e6; ;
    return return newnew Intl Intl. .NumberFormat NumberFormat( ('id-ID' 'id-ID', , { {
    style style: : 'currency' 'currency', ,
    currency currency: : 'IDR' 'IDR', ,
    minimumFractionDigits minimumFractionDigits: : 0 0, ,
    } }) ). .format format( (formatted formatted) ); ;
    } }
    typescript
    Custom Connect Button:
    // app/providers.tsx // app/providers.tsx
    import import '@rainbow-me/rainbowkit/styles.css' '@rainbow-me/rainbowkit/styles.css'; ;
    import import { { getDefaultConfig getDefaultConfig, , RainbowKitProvider RainbowKitProvider } } from from '@rainbow-me/rainbowkit' '@rainbow-me/rainbowkit'; ;
    import import { { WagmiProvider WagmiProvider } } from from 'wagmi' 'wagmi'; ;
    import import { { baseSepolia baseSepolia } } from from 'wagmi/chains' 'wagmi/chains'; ;
    const const config config = = getDefaultConfig getDefaultConfig( ({ {
    appName appName: : 'AuRoom' 'AuRoom', ,
    projectId projectId: : process process. .env env. .NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID! !, ,
    chains chains: : [ [baseSepolia baseSepolia] ], ,
    } }) ); ;
    export export function function Providers Providers( ({ { children children } }: : { { children children: : React React. .ReactNode ReactNode } }) ) { {
    return return ( (
    < <WagmiProvider WagmiProvider config config= ={ {config config} }> >
    < <RainbowKitProvider RainbowKitProvider> >
    { {children children} }
    < </ /RainbowKitProvider RainbowKitProvider> >
    < </ /WagmiProvider WagmiProvider> >
    ) ); ;
    } }
    typescript
    📊
    Success Metrics
    Technical Metrics (Must Achieve)
    Metric Target Measurement
    Time to Loan < 2 minutes From deposit to receiving IDRX
    Gas Efficiency < $0.50/tx On Base Sepolia
    Contract Coverage > 90% Unit test coverage
    Liquidation Accuracy 100% No false liquidations
    Price Staleness < 1 hour Chainlink feed freshness
    import import { { ConnectButton ConnectButton } } from from '@rainbow-me/rainbowkit' '@rainbow-me/rainbowkit'; ;
    export export function function CustomConnectButton CustomConnectButton( () ) { {
    return return ( (
    < <ConnectButton ConnectButton. .Custom Custom> >
    { {( ({ { account account, , chain chain, , openConnectModal openConnectModal, , mounted mounted } }) ) =>=> { {
    return return ( (
    < <divdiv> >
    { {! !mounted mounted |||| ! !account account |||| ! !chain chain ? ? ( (
    < <Button Button onClick onClick= ={ {openConnectModal openConnectModal} }> >
    Connect Connect Wallet Wallet
    < </ /Button Button> >
    ) ) : : ( (
    < <divdiv> >
    < <span span> >{ {account account. .displayName displayName} }< </ /span span> >
    < <span span> >{ {chain chain. .name name} }< </ /span span> >
    < </ /divdiv> >
    ) )} }
    < </ /divdiv> >
    ) ); ;
    } }} }
    < </ /ConnectButton ConnectButton. .Custom Custom> >
    ) ); ;
    } }
    User Experience Metrics
    Metric
    Target
    Measurement
    Wallet Connection
    < 10 seconds
    Time to connect + network switch
    Dashboard Load
    < 2 seconds
    First contentful paint
    Mobile Usability
    100%
    All core functions work on mobile
    Error Recovery
    Clear messaging
    User knows what to do when tx fails
    Business Metrics (Post-Hackathon)
    Metric
    Target
    Notes
    TVL
    $10,000
    Within 1 week of testnet launch
    Active Loans
    50+
    Unique addresses with loans
    Avg LTV
    50-60%
    Indicates conservative borrowing
    Liquidation Rate
    < 5%
    Low = users manage positions well
    🚫
    Out of Scope (Post-Hackathon)
    Features NOT in Hackathon MVP
1.
1.
1.
1.  Fiat Off-Ramp Integration
    Direct bank transfer
    Payment gateway integration
    Requires: Banking partnerships, KYC/AML
    Multi-Collateral Support
    PAXG, other gold tokens
    Requires: Multiple price feeds, complex valuation
    Governance Token
    AUROOM token
    Requires: Tokenomics design, distribution strategy
    Advanced Features
    Flash loans
    Leverage farming
1.  Cross-chain collateral
    Automated vault strategies
    Mobile App
1.  Native iOS/Android
    Progressive Web App (PWA) acceptable for now
    Credit Scoring
    On-chain credit history
    Dynamic LTV based on reputation
    Requires: Sybil resistance, historical data
    Deferred Integrations
1.
1.
1.  Notifications
    Email alerts for liquidation warnings
    Use: EPNS/Push Protocol in v2
    Analytics Dashboard
    Protocol-wide statistics
    Use: Dune Analytics initially
    Automated Liquidation Bots
    Keeper network integration
    Hackathon: Manual liquidation only
    🚀
    Deployment Plan
    Phase 1: Local Development (Day 1-3)
    Smart Contract:
    bash
    Frontend:
    Phase 2: Testnet Deployment (Day 4-5)
    Deploy Contracts to Base Sepolia:

# Initialize Foundry project # Initialize Foundry project

forge init auroom-contracts forge init auroom-contracts
cdcd auroom-contracts auroom-contracts

# Install dependencies # Install dependencies

forge forge install install OpenZeppelin/openzeppelin-contracts OpenZeppelin/openzeppelin-contracts
forge forge install install smartcontractkit/chainlink smartcontractkit/chainlink

# Create contracts # Create contracts

forge create src/AuRoomVault.sol forge create src/AuRoomVault.sol

# Run tests # Run tests

forge forge test test -vvv -vvv

# Coverage report # Coverage report

forge coverage forge coverage
bash

# Initialize Next.js # Initialize Next.js

npx create-next-app@latest auroom-frontend --typescript --tailwind --app npx create-next-app@latest auroom-frontend --typescript --tailwind --app

# Install dependencies # Install dependencies

npmnpm install install wagmi viem @rainbow-me/rainbowkit wagmi viem @rainbow-me/rainbowkit
npmnpm install install @tanstack/react-query zustand @tanstack/react-query zustand
npx shadcn-ui@latest init npx shadcn-ui@latest init

# Run dev server # Run dev server

npmnpm run dev run dev
bash

# Deploy script # Deploy script

forge script script/Deploy.s.sol:DeployScript forge script script/Deploy.s.sol:DeployScript \ \
 --rpc-url --rpc-url $BASE_SEPOLIA_RPC $BASE_SEPOLIA_RPC \ \
 --private-key --private-key $DEPLOYER_PRIVATE_KEY $DEPLOYER_PRIVATE_KEY \ \
 --broadcast --broadcast \ \
 --verify --verify \ \
 --etherscan-api-key --etherscan-api-key $BASESCAN_API_KEY $BASESCAN_API_KEY
Deployment Checklist:
Deploy MockXAUT (if real XAUT not available on testnet)
Deploy MockIDRX
Deploy AuRoomVault
Verify contracts on BaseScan
Initialize vault with test liquidity
Set Chainlink price feed address
Transfer ownership to multisig (optional for hackathon)
Frontend Environment Variables:
env

# .env.local

# .env.local

NEXT_PUBLIC_AUROOM_VAULT_ADDRESS=0x...
NEXT_PUBLIC_AUROOM_VAULT_ADDRESS=0x...
NEXT_PUBLIC_XAUT_ADDRESS=0x...
NEXT_PUBLIC_XAUT_ADDRESS=0x...
NEXT_PUBLIC_IDRX_ADDRESS=0x...
NEXT_PUBLIC_IDRX_ADDRESS=0x...
NEXT_PUBLIC_CHAINLINK_XAUT_USD_FEED=0x...
NEXT_PUBLIC_CHAINLINK_XAUT_USD_FEED=0x...
NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID=...
NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID=...
NEXT_PUBLIC_ALCHEMY_API_KEY=...
NEXT_PUBLIC_ALCHEMY_API_KEY=...
Phase 3: Testing & QA (Day 6-8)
Test Scenarios:

1.
2.
3. Happy Path:
   New user deposits XAUT
   User borrows 50% of max
   User repays 50%
   User withdraws excess collateral
   Edge Cases:
   Borrow max LTV → warning appears
   Price drops → health factor decreases
   Liquidation when LTV > 80%
   Multiple deposits/borrows/repayments
   Error Handling:
   Insufficient balance
   Insufficient allowance
   Network issues
   Transaction rejection
   Performance Testing:
   Load test with 10 concurrent users
   Measure gas costs per function
   Check mobile responsiveness
   Phase 4: Documentation & Submission (Day 9-10)
   Deliverables:
4.
5.
6.
7.
8. README.md
   Project description
   Installation instructions
   Architecture overview
   Demo video link
   ARCHITECTURE.md
   Contract structure
   Security considerations
   Upgrade path
   USER_GUIDE.md
   How to use AuRoom
   Screenshots/GIFs
   FAQ
   Video Demo (3-5 minutes)
   Problem introduction
   Live demo of core flow
   Technical highlights
   Vision & roadmap
   Hackathon Submission
   GitHub repo (public)
   Deployed frontend URL
   Contract addresses
   Demo video
   Presentation deck (if required)
   🔒
   Security Considerations
   Smart Contract Security
   Critical Checks:
9. Reentrancy Protection
   solidity
   import
   import "@openzeppelin/contracts/security/ReentrancyGuard.sol"
   "@openzeppelin/contracts/security/ReentrancyGuard.sol"; ;
   AuRoomVault isis ReentrancyGuard
   contract
   function
   contract AuRoomVault
   function deposit
   ReentrancyGuard { {
   deposit( () ) external
   external nonReentrant
   nonReentrant { { . .. .. . }
   function
   function borrow
   borrow( () ) external
   external nonReentrant
   // ... all state-changing functions
   // ... all state-changing functions
   }
   }
   }
   nonReentrant { { . .. .. . }
   }
10.
11. Integer Overflow/Underflow
    Use Solidity ^0.8.0 (built-in checks)
    Explicit checks for edge cases
    Price Manipulation
    solidity
    // Always check price freshness
    require
    // Always check price freshness
    require( (updatedAt
    updatedAt > > block
    block. .timestamp
    timestamp -- 1 1 hours
    hours, , "Stale price"
    "Stale price") ); ;
    // Use TWAP if possible (post-hackathon)
    // Use TWAP if possible (post-hackathon)
12.
13. Liquidation Front-Running
    Accept as known issue for MVP
    Post-hackathon: Implement MEV protection
    Access Control
    solidity
    import
    import "@openzeppelin/contracts/access/Ownable.sol"
    "@openzeppelin/contracts/access/Ownable.sol"; ;
    // Emergency pause
    // Emergency pause
    function pause
    function
    \_pause
    pause( () ) external
    external onlyOwner
    \_pause( () ); ;
    }
    }
    onlyOwner { {
    Testing Requirements:
    Unit tests for all functions
    Fuzz testing for numeric calculations
    Integration tests for multi-step flows
    Slither static analysis
    Frontend Security
14.
15.
16. Input Validation
    All numeric inputs validated
    Max values enforced
    Decimal precision checked
    Transaction Simulation
    Always simulate before writing
    Show estimated gas
    Confirm dialog for large amounts
    Error Messages
    User-friendly (no stack traces)
    Actionable (tell user what to do)
    No sensitive data exposed
    📞
    Support & Communication
    For Frontend Team
    Key References:
    wagmi docs:
    https://wagmi.sh
    RainbowKit docs:
    shadcn/ui:
    https://rainbowkit.com
    https://ui.shadcn.com
    Questions to Ask SC Team:
    "What's the exact ABI for
    getPosition() ?"
    "What error messages should I handle?"
    "What's the expected gas cost for each function?"
    For Smart Contract Team
    Key References:
    Foundry book:
    https://book.getfoundry.sh
    OpenZeppelin docs:
    https://docs.openzeppelin.com
    Chainlink docs:
    https://docs.chain.link
    Questions to Ask FE Team:
    "What format do you need for position data?"
    "What loading states should I emit events for?"
    "What decimal precision for display?"
    🎯
    Definition of Done
    Contract is Done When:
    All 5 core functions implemented
    Unit tests passing (>90% coverage)
    Deployed to Base Sepolia
    Verified on BaseScan
    No critical Slither warnings
    Frontend is Done When:
    All 6 pages/modals functional
    Mobile responsive
    Real-time data updates working
    Error states handled gracefully
    Deployed to Vercel
    MVP is Done When:
    User can complete full flow end-to-end
    No blockers for demo
    README + demo video ready
    Submission form filled
    📅
    Suggested Timeline (10 Days)
    Day
    Frontend
    Smart Contract
    1-2
    Setup + Component library
    Contract architecture + tests
    3-4
    Dashboard + Deposit modal
    Deploy testnet + integrate Chainlink
    5-6
    Borrow + Repay modals
    Liquidation logic + testing
    Day
    Frontend
    Smart Contract
    7-8
    Withdraw + Liquidation page
    Bug fixes + gas optimization
    9
    Integration testing
    Support FE integration
    10
    Polish + documentation
    Final review + security check
    🏁
    Conclusion
    This document serves as the single source of truth for AuRoom MVP development. Any deviations from this
    spec should be:
17.
18.
19. Discussed with the team
    Documented in a CHANGELOG
    Updated in this document
    Remember: We're building an MVP, not a final product. Focus on core functionality, user experience, and
    demonstrating the vision.
    Good luck, and let's ship AuRoom! 🚀
    Appendix A: Contract Addresses (To Be Filled)
    Network: Base Sepolia
    Network: Base Sepolia
    AuRoomVault: 0x...
    AuRoomVault: 0x...
    MockXAUT: 0x...
    MockXAUT: 0x...
    MockIDRX: 0x...
    MockIDRX: 0x...
    Chainlink XAUT/USD Feed: 0x...
    Chainlink XAUT/USD Feed: 0x...
    Appendix B: Glossary
    LTV: Loan-to-Value ratio (debt / collateral value)
    Health Factor: Liquidation threshold / current LTV
    XAUT: Tether Gold (gold-backed ERC-20 token)
    IDRX: Indonesian Rupiah stablecoin
    RWA: Real World Assets
    TVL: Total Value Locked
    Appendix C: Quick Reference Links
    Base Sepolia Faucet:
    BaseScan Sepolia:
    https://www.coinbase.com/faucets/base-ethereum-sepolia-faucet
    https://sepolia.basescan.org
    Chainlink Feeds:
    https://docs.chain.link/data-feeds/price-feeds/addresses
    GitHub Repo: [To be created]
    Demo URL: [To be deployed]
