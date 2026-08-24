// Content for the /get-koin beginner guide.
//
// Everything a maintainer needs to change lives here: official links, the
// wallet/route matrix and the step copy. Token addresses come from
// data/koinTokens.js, which the homepage exchange section also uses.
//
// The page component only renders what this file describes.
//
// MAINTENANCE: re-walk every route and re-take every screenshot after any
// bridge, token or contract migration, then bump LAST_VERIFIED. Captions derive
// their date from it, so a stale date is visible on the page.

import { SWAP_LINKS, VKOIN_CONTRACTS, contractFor } from "@/data/koinTokens";

export const LAST_VERIFIED = "24 August 2026";

const IMG = "/images/pages/get-koin";

export const CONTRACTS = VKOIN_CONTRACTS;

export const OFFICIAL_LINKS = {
  vortex: "https://vortexbridge.io/bridge",
  koindx: SWAP_LINKS.koindx,
  kondor:
    "https://chromewebstore.google.com/detail/kondor/ghipkefkpgkladckmlmdnadmcchefhjl",
  kondorSite: "https://kondorwallet.com/",
  docs: "https://docs.koinos.io",
  mana: "https://docs.koinos.io/overview/mana/",
  telegram: "https://telegram.koinos.io",
};

// Captions carry their own provenance so a reader can tell a screenshot of a
// third-party product from something we drew.
function captured(where) {
  return `${where}, captured ${LAST_VERIFIED}.`;
}

function sourced(what, where) {
  return `${what} Source: ${where}, retrieved ${LAST_VERIFIED}.`;
}

// --- Wallets --------------------------------------------------------------

export const WALLETS = [
  {
    id: "metamask",
    name: "MetaMask",
    family: "Ethereum and Base",
    summary:
      "The most widely used browser wallet for Ethereum and Base. It asks you to confirm every transaction in a small pop-up.",
    install: "https://metamask.io/download",
    installLabel: "metamask.io/download",
    routes: ["ethereum", "base"],
    addressKind: "an Ethereum-style address",
    addressNote:
      "The same address works on Ethereum and on Base, but it does not work on Solana or Koinos.",
    quirks: [
      "MetaMask shows the current network at the top of its window. Check it says the network in your plan before you confirm anything.",
      "If a website asks to switch network, MetaMask shows a separate request for that. This is normal and it is not a spending permission.",
      "If vKOIN does not appear after a swap, use Import tokens and paste the contract address from this page.",
      "A spending cap is a different thing from connecting. It appears only when a website needs permission to move a token you already hold. Set it to the amount you are using rather than an unlimited amount.",
    ],
  },
  {
    id: "rabby",
    name: "Rabby",
    family: "Ethereum and Base",
    summary:
      "A browser wallet for Ethereum-style networks. Before you sign, it simulates the transaction and shows the balance changes it expects.",
    install: "https://rabby.io/",
    installLabel: "rabby.io",
    routes: ["ethereum", "base"],
    addressKind: "an Ethereum-style address",
    addressNote:
      "The same address works on Ethereum and on Base, but it does not work on Solana or Koinos.",
    quirks: [
      "Rabby usually follows the network the website asks for, so you rarely switch networks by hand.",
      "Rabby shows a check before you sign, with the balance changes it expects. Read it. If the expected result is not the swap you asked for, reject it.",
      "Some websites list Rabby as Browser Wallet or Injected Wallet instead of by name.",
      "Rabby normally finds standard tokens on its own. If vKOIN is missing, add it using the contract address from this page.",
    ],
  },
  {
    id: "phantom",
    name: "Phantom",
    family: "Solana",
    summary:
      "A browser wallet for Solana. Solana has no separate token permission step, so you sign the swap itself.",
    install: "https://phantom.com/download",
    installLabel: "phantom.com/download",
    routes: ["solana"],
    addressKind: "a Solana address",
    addressNote:
      "Phantom keeps a separate address for each network it supports. For this guide you need the Solana one.",
    quirks: [
      "Phantom is used here for Solana only. This guide does not cover Phantom on Ethereum or Base.",
      "Solana tokens usually appear on their own after a swap. Phantom does not import tokens by contract address the way MetaMask does.",
      "Keep a small amount of SOL. Solana charges a fee for the swap and may charge a small one-time cost to create the token account.",
      "If vKOIN is missing from the list, check the hidden tokens setting before assuming anything went wrong.",
    ],
  },
  {
    id: "kondor",
    name: "Kondor",
    family: "Koinos",
    summary:
      "The Koinos browser wallet. It holds native KOIN, and it is the wallet KoinDX and the Koinos side of Vortex connect to.",
    install:
      "https://chromewebstore.google.com/detail/kondor/ghipkefkpgkladckmlmdnadmcchefhjl",
    installLabel: "the Kondor listing on the Chrome Web Store",
    routes: ["koinos"],
    addressKind: "a Koinos address",
    addressNote:
      "A Koinos address looks nothing like an Ethereum or Solana address, and none of them can stand in for another.",
    quirks: [
      "Kondor holds a Koinos address only. It cannot receive assets sent on Ethereum, Base or Solana.",
      "Kondor shows your mana next to your KOIN balance. Mana is what Koinos transactions use.",
      "Kondor asks you to confirm each action separately in the extension window.",
      "Its receive screen warns you to send only Koinos tokens to that address. Take that warning seriously.",
    ],
  },
];

// --- Routes ---------------------------------------------------------------
//
// The reason the routes end differently: the Vortex bridge currently connects
// Koinos and Ethereum only — its network chooser offers exactly those two. So
// vKOIN bought on Base or Solana cannot be turned into native KOIN in one step,
// and the guide says so instead of implying a bridge that does not exist.
//
// The Koinos route is deliberately NOT a way to buy your first KOIN. KoinDX
// runs on Koinos, and a Koinos account gets its mana from its own KOIN balance,
// so an account holding no KOIN cannot transact there yet.

export const ROUTES = [
  {
    id: "ethereum",
    name: "Ethereum",
    tagline: "Buy vKOIN on Ethereum, then bridge it to native KOIN.",
    buyAsset: "ETH",
    network: "Ethereum",
    gasAsset: "ETH",
    dex: "DeFiLlama",
    dexUrl: SWAP_LINKS.ethereum,
    reachesNativeKoin: true,
    outcome: "native KOIN on Koinos",
    outcomeShort: "Ends with native KOIN",
    plan:
      "Buy ETH, send it to your own wallet on Ethereum, swap it for vKOIN, then use Vortex to move it to Koinos as native KOIN.",
    note:
      "This is the route the bridge supports end to end, because Vortex connects Koinos and Ethereum.",
  },
  {
    id: "base",
    name: "Base",
    tagline: "Buy vKOIN on Base. Network fees are usually lower here.",
    buyAsset: "ETH",
    network: "Base",
    gasAsset: "ETH on Base",
    dex: "DeFiLlama",
    dexUrl: SWAP_LINKS.base,
    reachesNativeKoin: false,
    outcome: "vKOIN on Base",
    outcomeShort: "Ends with vKOIN",
    plan:
      "Buy ETH, send it to your own wallet on Base, then swap it for vKOIN on Base.",
    note:
      "Vortex connects Koinos and Ethereum. It does not offer Base, so this route stops at vKOIN. If you want native KOIN, decide that before you buy and use the Ethereum route.",
  },
  {
    id: "solana",
    name: "Solana",
    tagline: "Buy vKOIN on Solana.",
    buyAsset: "SOL",
    network: "Solana",
    gasAsset: "SOL",
    dex: "Jupiter",
    dexUrl: SWAP_LINKS.solana,
    reachesNativeKoin: false,
    outcome: "vKOIN on Solana",
    outcomeShort: "Ends with vKOIN",
    plan:
      "Buy SOL, send it to your own wallet on Solana, then swap it for vKOIN on Solana.",
    note:
      "Vortex connects Koinos and Ethereum. It does not offer Solana, so this route stops at vKOIN. If you want native KOIN, decide that before you buy and use the Ethereum route.",
  },
  {
    id: "koinos",
    name: "Koinos",
    tagline: "Set up a Koinos wallet and use KoinDX once it holds KOIN.",
    buyAsset: null,
    network: "Koinos",
    gasAsset: "mana",
    dex: "KoinDX",
    dexUrl: SWAP_LINKS.koindx,
    reachesNativeKoin: true,
    outcome: "a working Koinos wallet",
    outcomeShort: "Needs KOIN first",
    plan:
      "Install Kondor, receive native KOIN into it using the Ethereum route, and then trade on Koinos with KoinDX.",
    note:
      "This is not a way to buy your first KOIN. KoinDX runs on Koinos, and a Koinos account draws its mana from its own KOIN balance, so an empty account cannot trade there yet.",
  },
];

// --- Compatibility --------------------------------------------------------

export function isSupported(walletId, routeId) {
  const wallet = WALLETS.find((w) => w.id === walletId);
  return Boolean(wallet && wallet.routes.includes(routeId));
}

export function suggestionFor(walletId, routeId) {
  const wallet = WALLETS.find((w) => w.id === walletId);
  const route = ROUTES.find((r) => r.id === routeId);
  if (!wallet || !route) return null;
  const worksWith = WALLETS.filter((w) => w.routes.includes(routeId)).map(
    (w) => w.name
  );
  return {
    message: `${wallet.name} is not used for the ${route.name} route in this guide.`,
    walletFix: `${wallet.name} works with the ${wallet.routes
      .map((id) => ROUTES.find((r) => r.id === id).name)
      .join(" and ")} route.`,
    routeFix: worksWith.length
      ? `The ${route.name} route is shown with ${worksWith.join(" or ")}.`
      : null,
    suggestedRoute: wallet.routes[0],
  };
}

// --- Wallet screenshots ---------------------------------------------------
//
// Extension pop-ups cannot be captured from a normal browser session, so these
// come from each vendor's own documentation and are credited in the caption.
// Rabby publishes no instructional screenshots, so the Rabby steps rely on the
// written description and the shared exchange screenshots instead.

const WALLET_IMAGES = {
  metamask: {
    address: {
      src: `${IMG}/metamask-network.png`,
      alt: "The MetaMask extension window with the network selector open, showing the list of available networks.",
      caption: sourced(
        "MetaMask shows the current network at the top.",
        "support.metamask.io"
      ),
      frame: "phone",
    },
    connect: {
      src: `${IMG}/metamask-connect.png`,
      alt: "The MetaMask connection pop-up asking to connect a website, with the account listed and Cancel and Connect buttons.",
      caption: sourced(
        "A connection request. Connecting lets a site see your address; it does not let it move your tokens. The site name at the top must match the site you opened — here it is an example site, not one used in this guide.",
        "support.metamask.io"
      ),
      frame: "phone",
    },
    token: {
      src: `${IMG}/metamask-import-token.png`,
      alt: "The MetaMask Import tokens dialog on the Custom token tab, with fields for the network, the token contract address and the token symbol, above a warning that anyone can create a fake version of an existing token.",
      caption: sourced(
        "Adding a token by contract address, if it does not appear by itself. MetaMask gives the same warning this page does. The example shown is a different token.",
        "support.metamask.io"
      ),
      frame: "phone",
    },
  },
  phantom: {
    address: {
      src: `${IMG}/phantom-receive.png`,
      alt: "Two Phantom screens: the wallet with the Receive button highlighted, and the resulting list of networks where the Solana address can be copied.",
      caption: sourced(
        "Phantom keeps one address per network. Copy the Solana one.",
        "help.phantom.com"
      ),
    },
  },
  kondor: {
    address: {
      src: `${IMG}/kondor-receive.png`,
      alt: "The Kondor wallet Receive KOIN screen, showing a QR code, the Koinos address and a warning to send only Koinos tokens to it.",
      caption: sourced("Kondor's receive screen.", "kondorwallet.com"),
      frame: "phone",
    },
  },
  rabby: {},
};

// --- Shared step fragments ------------------------------------------------

const ADDRESS_CHECK =
  "Compare the whole address, not only its beginning and end. Attackers deliberately generate addresses that share the first and last characters with one of yours. Copy the address from your wallet's own receive screen, never from a transaction list or a message.";

function walletSetupStep(wallet) {
  return {
    id: "wallet",
    title: `Install ${wallet.name} and copy your address`,
    context:
      "A wallet holds your keys. Nothing can arrive until you have one and know its address.",
    body: [
      `Install ${wallet.name} only from ${wallet.installLabel}. Never install a wallet from an advertisement, from a search result you do not recognise, or from a link someone sent you.`,
      "During setup the wallet shows a recovery phrase. Write it on paper and keep it offline. Anyone who has those words can take everything in the wallet. No website, no support agent and no part of Koinos will ever need it.",
    ],
    micro: [
      `Open ${wallet.installLabel} and add the extension.`,
      "Create a new wallet and set a password.",
      "Write the recovery phrase on paper. Do not photograph it or save it in a note, chat or cloud drive.",
      "Open the wallet and find your receive address.",
      "Copy the address. You will paste it in a later step.",
    ],
    image: WALLET_IMAGES[wallet.id].address || null,
    callouts: [
      {
        type: "warning",
        text: `${wallet.name} gives you ${wallet.addressKind}. ${wallet.addressNote} Sending an asset on the wrong network is one of the most common ways beginners lose funds, and it usually cannot be undone.`,
      },
    ],
    check: `${wallet.name} is installed, the recovery phrase is written down offline, and you have copied your address.`,
  };
}

function kondorSetupStep() {
  return {
    id: "kondor",
    title: "Install Kondor, so there is somewhere for the KOIN to land",
    context:
      "Native KOIN lives on Koinos, and your Ethereum wallet cannot hold it. You need a Koinos address before the bridge step.",
    body: [
      "Kondor is a browser wallet for Koinos. Install it from its Chrome Web Store listing, linked below. Do not search for it — a search result is exactly where a fake wallet would sit.",
      "Set it up the same way as your other wallet: create a new wallet, set a password, and write the recovery phrase on paper. Then open the receive screen and copy the Koinos address.",
    ],
    micro: [
      "Open the official Kondor listing using the button below and add the extension.",
      "Create a wallet and set a password.",
      "Write the recovery phrase on paper and keep it offline.",
      "Open Receive and copy your Koinos address.",
    ],
    link: { href: OFFICIAL_LINKS.kondor, label: "Open the Kondor listing" },
    image: WALLET_IMAGES.kondor.address,
    callouts: [
      {
        type: "warning",
        text: "Kondor's own receive screen says it: send only Koinos assets to this address. It cannot receive anything sent on Ethereum, Base or Solana.",
      },
    ],
    check: "Kondor is installed and you have copied its Koinos address.",
  };
}

function buyStep(route) {
  return {
    id: "buy",
    title: `Buy ${route.buyAsset} on an exchange`,
    context: `You start with money and end with ${route.buyAsset} sitting in an exchange account.`,
    body: [
      `In most countries you cannot buy KOIN directly with a bank card. You first buy ${route.buyAsset}, then trade it for vKOIN in a later step. ${route.buyAsset} also pays the network fees along the way, so buy a little more than you plan to swap.`,
      "Use an exchange that operates in your country and that can withdraw on the network in your plan. Coinbase, Kraken and Binance are examples of large exchanges. They are named as examples only: this is not a recommendation, Koinos has no relationship with any of them, and there are no referral links on this page. Identity checks, payment methods and available networks differ by country and by account.",
    ],
    micro: [
      "Open an account at an exchange available where you live and complete its identity check.",
      "Add money using a payment method it offers.",
      `Buy ${route.buyAsset}.`,
      `Before you continue, check that the exchange can withdraw ${route.buyAsset} on ${route.network}.`,
    ],
    callouts: [
      {
        type: "warning",
        text: `Check the withdrawal networks before you buy. Not every exchange that sells ${route.buyAsset} can send it on ${route.network}. If yours cannot, choose a different exchange or a different route.`,
      },
      {
        type: "cost",
        text: "Exchanges usually charge to buy and again to withdraw. Read the figures the exchange shows you before each confirmation; they change.",
      },
    ],
    check: `You hold ${route.buyAsset} on the exchange, and the exchange offers ${route.network} withdrawals.`,
  };
}

function withdrawStep(wallet, route) {
  return {
    id: "withdraw",
    title: `Send your ${route.buyAsset} to ${wallet.name} on ${route.network}`,
    context: `This moves your ${route.buyAsset} off the exchange and into the wallet you control.`,
    body: [
      `Open the withdrawal screen for ${route.buyAsset} on the exchange and paste your ${wallet.name} address. Then choose the network. It must say ${route.network}.`,
      "Consider sending a small test amount first and waiting until it arrives before sending the rest. It costs one extra withdrawal fee, and it turns a total loss into a small one if something is wrong.",
      ADDRESS_CHECK,
    ],
    micro: [
      `Paste your ${wallet.name} address into the exchange withdrawal form.`,
      "Check the whole address against your wallet, not just its ends.",
      `Select ${route.network} as the network.`,
      "Read the fee and the amount that will actually arrive.",
      "Send a small test amount and wait for it to appear before sending more.",
    ],
    callouts: [
      {
        type: "warning",
        text: `${route.network} must be selected on the exchange. The same address can exist on several networks, and the exchange will not warn you if you pick the wrong one.`,
      },
      {
        type: "tip",
        text: `Leave enough ${route.gasAsset} for the steps that follow. Do not swap your whole balance.`,
      },
    ],
    check: `${wallet.name} shows your ${route.buyAsset} on ${route.network}.`,
  };
}

function swapStep(wallet, route) {
  const contract = contractFor(route.network);
  const isJupiter = route.dex === "Jupiter";
  return {
    id: "swap",
    title: `Swap ${route.buyAsset} for vKOIN on ${route.dex}`,
    context: `You end this step holding vKOIN on ${route.network}.`,
    body: [
      `Open ${route.dex} using the button below, so the correct network and token are already filled in. Then check your browser's address bar. Convincing fake copies of swap websites exist.`,
      isJupiter
        ? "Jupiter shows warnings on tokens that few people trade. A warning on vKOIN does not by itself mean the token is fake, but it does mean you should confirm the token address yourself before swapping."
        : "DeFiLlama compares several exchanges and routes your trade to one of them, so the venue behind a quote can differ from one visit to the next.",
      `Compare the token address shown by the site with the official address on this page: ${
        contract ? contract.address : ""
      }. Anyone can create a token called vKOIN.`,
      `Because you are paying with ${route.buyAsset}, which is the network's own asset, no separate token permission is needed for this swap. You sign the swap itself.`,
    ],
    micro: [
      `Open ${route.dex} and connect ${wallet.name}.`,
      `Check that the network is ${route.network}.`,
      `Enter how much ${route.buyAsset} you want to spend, keeping some back for fees.`,
      "Compare the token address with the official address on this page.",
      "Read the amount you are shown, then sign in your wallet.",
    ],
    link: { href: route.dexUrl, label: `Open ${route.dex}` },
    image:
      route.id === "ethereum"
        ? {
            src: `${IMG}/defillama-ethereum.png`,
            alt: "The DeFiLlama swap page with Ethereum selected, ETH in the You sell field and vKOIN in the You buy field.",
            caption: captured("swap.defillama.com on Ethereum"),
          }
        : route.id === "base"
        ? {
            src: `${IMG}/defillama-base.png`,
            alt: "The DeFiLlama swap page with Base selected, ETH in the You sell field and vKOIN in the You buy field.",
            caption: captured("swap.defillama.com on Base"),
          }
        : {
            src: `${IMG}/jupiter-solana.png`,
            alt: "The Jupiter swap page with SOL in the Sell field and vKOIN in the Buy field, showing a warning label under the vKOIN token.",
            caption: captured("jup.ag"),
          },
    extraImages: [
      WALLET_IMAGES[wallet.id].connect,
      WALLET_IMAGES[wallet.id].token,
    ].filter(Boolean),
    callouts: [
      {
        type: "warning",
        text: "Check the token address, not the name or the logo. A copied name and logo cost nothing to make.",
      },
      {
        type: "cost",
        text: `Expect a network fee in ${route.gasAsset} and a trading fee, and expect your own order to move the price if the pool is small. The figures the site shows before you sign are the ones that apply; the amount you finally receive can still differ if the price moves while the transaction is being processed.`,
      },
    ],
    check: `Your wallet shows vKOIN on ${route.network}.`,
  };
}

function bridgeStep() {
  return {
    id: "bridge",
    title: "Move your vKOIN to Koinos with Vortex",
    context:
      "You end this step holding native KOIN on the Koinos blockchain, in your Kondor wallet.",
    body: [
      "Vortex moves value between Ethereum and Koinos. You hand vKOIN to the bridge on Ethereum, and native KOIN becomes available to the Koinos address you name.",
      "Vortex opens with a disclaimer stating that the interface and the protocol are provided as is, are not audited, and may not work correctly, which could result in the loss of your tokens. That is the bridge's own wording. Read it before you decide, not after.",
      "Because you are handing over a token you already hold, rather than the network's own asset, the bridge needs your permission to move that token before the transfer itself. That is two signatures, not one.",
      "Vortex does not finish on its own. After the transfer is validated you redeem it on the destination side. The bridge states this on its own page: the user is responsible for claiming their tokens on the destination blockchain.",
    ],
    micro: [
      "Open vortexbridge.io using the button below, read the disclaimer, and continue only if you accept it.",
      "Set From to Ethereum and To to Koinos.",
      "Choose vKOIN as the token and enter the amount.",
      "Paste your Kondor address and check the whole address, not just its ends.",
      "Sign what your wallet asks for, then wait, then complete the redeem step.",
    ],
    link: { href: OFFICIAL_LINKS.vortex, label: "Open Vortex" },
    image: {
      src: `${IMG}/vortex-bridge-form.png`,
      alt: "The Vortex bridge form, with From and To network selectors, an amount field, a token selector, a receiving address field and a note that the user is responsible for claiming their tokens on the destination blockchain.",
      caption: captured("The form you will fill in. vortexbridge.io"),
    },
    extraImages: [
      {
        src: `${IMG}/vortex-networks.png`,
        alt: "The Vortex bridge network chooser, listing exactly two networks: Koinos and Ethereum.",
        caption:
          "The network chooser offers two networks, and only two. This is why Base and Solana have no direct route to Koinos.",
      },
      {
        src: `${IMG}/vortex-tokens.png`,
        alt: "The Vortex token chooser showing vKOIN, ETH, USDT and USDC.",
        caption:
          "Choose vKOIN. The other tokens arrive on Koinos as their own wrapped versions, not as KOIN.",
      },
      {
        src: `${IMG}/vortex-redeem.png`,
        alt: "The Vortex Redeem tab, with fields for a source network, a redeem network and a source transaction ID.",
        caption:
          "If you close the page before redeeming, the Redeem tab resumes a transfer from its source transaction ID. Keep that ID.",
      },
    ],
    callouts: [
      {
        type: "warning",
        text: "Save the source transaction hash before you close the page. If the redeem step does not happen, that hash is what lets you resume the transfer from the Redeem tab.",
      },
      {
        type: "warning",
        text: "A bridge is a piece of software holding your value in transit. Vortex says plainly that it is unaudited and may malfunction. Only move an amount you could afford to lose.",
      },
      {
        type: "cost",
        text: "On the Ethereum side you pay Ethereum network fees, once to permit the token and once to deposit it. The redeem happens on the Koinos side, where transactions use mana rather than a gas fee. Read what the bridge and your wallets ask for at each stage instead of relying on any figure written here.",
      },
      {
        type: "tip",
        text: "Move a small amount first and complete the whole journey, including the redeem, before you move a larger amount.",
      },
    ],
    check:
      "The bridge reports the transfer as complete, and Kondor shows a native KOIN balance.",
  };
}

function holdStep(route) {
  return {
    id: "hold",
    title: `You now hold vKOIN on ${route.network}`,
    context: "This is the moment to be clear about what you actually own.",
    body: [
      `vKOIN on ${route.network} is a wrapped token. It is intended to represent KOIN and it trades on ${route.network}, but it is a separate token: its price can move differently, and what it is worth depends on the bridge behind it continuing to honour redemptions. It is not native KOIN and it gives you no mana on Koinos.`,
      "Vortex, the Koinos bridge, connects Koinos and Ethereum only. Its network chooser offers exactly those two. So vKOIN held on Base or Solana has no single step that turns it into native KOIN.",
      "If you want native KOIN, that decision belongs before you buy: use the Ethereum route from the start. Do not try to send the vKOIN you are holding now to Ethereum or to a Koinos address directly — an ordinary transfer will not cross networks and the funds will not arrive. Moving a wrapped token between networks needs a separate general-purpose bridge, which this guide does not cover and has not tested.",
    ],
    micro: [
      "Check that your wallet shows vKOIN and the amount you expected.",
      "Compare the token address with the official address on this page.",
      "Decide whether you are content holding vKOIN here, understanding that it depends on the bridge that issued it.",
    ],
    callouts: [
      {
        type: "warning",
        text: "Holding a wrapped token means depending on the bridge that issued it, for as long as you hold it. That risk does not fade with time.",
      },
    ],
    check: `Your wallet shows vKOIN on ${route.network} and the address matches the official one.`,
  };
}

function koinosFundStep() {
  return {
    id: "fund",
    title: "Get native KOIN into your Kondor wallet",
    context:
      "An empty Koinos account cannot do anything yet. This is the step that changes that.",
    body: [
      "Koinos has no gas fee. Instead, an account draws mana from the KOIN it holds, and transactions spend mana. An account holding no KOIN therefore has no mana, and cannot swap, send, or use KoinDX.",
      "So KoinDX cannot be your first move. You need native KOIN in the wallet first, and the route this guide has tested for that is the Ethereum one: buy vKOIN on Ethereum, then bridge it to Koinos with Vortex, sending it to the Kondor address from the previous step.",
      "Bring across a little more than the minimum you had in mind. A larger action such as a swap needs more mana than a simple transfer, and mana refills over the following days rather than instantly.",
    ],
    micro: [
      "Follow the Ethereum route in this guide, using your Kondor address as the destination.",
      "Wait for the bridge transfer to complete, including the redeem step.",
      "Check that Kondor shows both a KOIN balance and mana.",
    ],
    routeLink: {
      wallet: "metamask",
      route: "ethereum",
      label: "Show me the Ethereum route",
    },
    callouts: [
      {
        type: "warning",
        text: "Do not send KOIN from an exchange to Kondor unless that exchange explicitly supports withdrawals on the Koinos network. Most do not.",
      },
    ],
    check: "Kondor shows a native KOIN balance and available mana.",
  };
}

function koinDxSwapStep() {
  return {
    id: "koindx",
    title: "Trade on Koinos with KoinDX",
    context:
      "With KOIN and mana in the wallet, you can now trade Koinos assets without leaving Koinos.",
    body: [
      "KoinDX is a decentralised exchange that runs on Koinos. It swaps between assets that already exist on Koinos: native KOIN, the project's own token, and assets brought over by the bridge.",
      "Open it, accept its terms, and connect Kondor from the list of Koinos wallets. Choose the two tokens, read the trade details, and confirm in the extension.",
      "Keep some KOIN after any trade. It is what gives the account mana for whatever you do next, and a pair that few people trade will give you a worse price on a large order.",
    ],
    micro: [
      "Open app.koindx.com and tick the box to accept the terms.",
      "Choose Kondor Wallet and confirm the connection in the extension.",
      "Set the token you are paying with and the token you want.",
      "Enter the amount and read the details of the trade.",
      "Confirm the transaction in Kondor.",
    ],
    link: { href: OFFICIAL_LINKS.koindx, label: "Open KoinDX" },
    image: {
      src: `${IMG}/koindx-connect.png`,
      alt: "The KoinDX connect dialog: a checkbox to accept terms and privacy, then a list of wallets with Kondor Wallet, My Koinos Wallet and Wallet Connect.",
      caption: captured(
        "KoinDX asks you to accept its terms before it offers the wallet list. app.koindx.com"
      ),
    },
    extraImages: [
      {
        src: `${IMG}/koindx-swap.png`,
        alt: "The KoinDX swap card with two token fields, here showing KOIN and KOINDX, and a Connect button.",
        caption: captured(
          "The swap screen before a wallet is connected. It opens on whichever pair it defaults to — set both tokens yourself. app.koindx.com"
        ),
      },
    ],
    callouts: [
      {
        type: "tip",
        text: "Leave enough KOIN in the account to keep some mana available. Spending down to nothing leaves the account unable to act until it is topped up again.",
      },
    ],
    check: "Kondor shows the result of the trade.",
  };
}

export function buildSteps(walletId, routeId) {
  const wallet = WALLETS.find((w) => w.id === walletId);
  const route = ROUTES.find((r) => r.id === routeId);
  if (!wallet || !route || !isSupported(walletId, routeId)) return [];

  if (route.id === "koinos") {
    return [walletSetupStep(wallet), koinosFundStep(), koinDxSwapStep()];
  }

  const steps = [
    walletSetupStep(wallet),
    buyStep(route),
    withdrawStep(wallet, route),
    swapStep(wallet, route),
  ];

  if (route.reachesNativeKoin) {
    steps.push(kondorSetupStep(), bridgeStep());
  } else {
    steps.push(holdStep(route));
  }

  return steps;
}

// --- Static copy ----------------------------------------------------------

export const INTRO = {
  title: "How to buy KOIN",
  lead:
    "A step-by-step guide for people who have never bought a cryptocurrency before.",
  paragraphs: [
    "This guide starts at the very beginning. You do not need to own any crypto, and you do not need to know what a wallet is.",
    "Choose your wallet and your route below, and the steps rewrite themselves for the tools you actually use. Every step says where your money is before it starts and where it will be when it finishes.",
    "Take your time. Send a small test amount before a large one. Nothing here is urgent.",
  ],
};

export const RISK_NOTE = {
  title: "Read this before you choose",
  points: [
    "Buying KOIN means using several independent services in a row: an exchange, a decentralised exchange, and in one route a bridge. Each is run by someone else and each can fail.",
    "The Vortex bridge, which is how wrapped vKOIN becomes native KOIN, opens with its own disclaimer: the interface and protocol are provided as is, are not audited, and might not work correctly, which could result in the loss of your tokens. Only use it with an amount you could afford to lose.",
    "Blockchain transactions cannot be reversed. There is no support line that can undo a mistake for you.",
  ],
};

export const NATIVE_VS_WRAPPED = {
  title: "There are two different things called KOIN",
  intro:
    "This trips up almost everyone at the start, and it is worth two minutes now to save an expensive mistake later.",
  columns: [
    {
      name: "Native KOIN",
      where: "On the Koinos blockchain",
      points: [
        "The token of the Koinos blockchain itself.",
        "Gives the account mana, which is what Koinos transactions use instead of a fee.",
        "Held in a Koinos wallet such as Kondor.",
        "Needed to use Koinos applications.",
      ],
    },
    {
      name: "vKOIN",
      where: "On Ethereum, Base or Solana",
      points: [
        "A wrapped token, issued by the Vortex bridge to represent KOIN elsewhere.",
        "Gives no mana and does nothing on Koinos.",
        "Held in an Ethereum or Solana wallet such as MetaMask, Rabby or Phantom.",
        "Tradeable where it lives, and dependent on the bridge continuing to honour redemptions.",
      ],
    },
  ],
  outro: [
    "Sending vKOIN to a Koinos address does not turn it into KOIN. The two live on different blockchains, and the Vortex bridge is what moves value between them.",
    "Which one suits you depends on what you want to do. vKOIN can be traded on the network it lives on. Native KOIN is what Koinos applications use, and holding it does not depend on a bridge. Both can lose value.",
  ],
};

export const MANA = {
  title: "Mana, and why your first Koinos transaction is different",
  paragraphs: [
    "Koinos has no gas fee. Instead, holding KOIN gives the account mana, and transactions spend mana. Mana refills over the following days, so the same KOIN can be used again and again.",
    "This has one consequence beginners run into: an account holding no KOIN has no mana, and an account holding very little has very little. A swap needs more mana than a simple transfer. It is the reason a brand-new Koinos wallet cannot trade until KOIN reaches it.",
    "The practical advice is short. Bring across a bit more than the minimum you had in mind, do not try to move your entire balance in one transaction, and if a transaction is refused for lack of mana, wait rather than repeat it.",
  ],
  linkLabel: "Read the mana documentation",
  linkHref: OFFICIAL_LINKS.mana,
};

export const SAFETY = {
  title: "Before you send anything, check these",
  items: [
    "Open wallets, swap sites and Vortex from the links on this page, then check your browser's address bar. Convincing fake copies of these sites exist.",
    "Never type or photograph your recovery phrase. No website, wallet support agent or member of the Koinos community will ever need it.",
    "Read the asset and the network together. ETH on Base and ETH on Ethereum are not interchangeable.",
    "Compare token addresses, not names or logos. Anyone can create a token called vKOIN.",
    "Check a destination address in full, including the middle. Attackers generate addresses that match yours at the start and the end.",
    "Copy addresses from your wallet's receive screen, never from a transaction list or a message.",
    "Send a small test amount first, and wait for it to arrive.",
    "Keep enough ETH or SOL for the steps still to come. Do not swap your entire balance.",
    "Read every wallet pop-up. The site, token, amount and destination should match the step you are on.",
    "Connecting a wallet is not the same as giving permission to move a token. A permission with an unlimited amount deserves more care than one for the amount you are actually using.",
    "Disconnecting a wallet from a site does not cancel a token permission you already granted. Those are revoked separately.",
    "If a transfer is pending, do not repeat it. Save the transaction hash and check its status first.",
    "Ignore anyone who contacts you privately offering help, recovery, a better price or a faster bridge. That is how people are robbed.",
  ],
};

export const FAQS = [
  {
    q: "Can I buy KOIN with a credit card?",
    a: "Not directly, in most countries. You buy ETH or SOL on an exchange first, move it to your own wallet, and then swap it for vKOIN. To end up with native KOIN, the Ethereum route then bridges that vKOIN across with Vortex.",
  },
  {
    q: "Which route should I choose?",
    a: "If you want native KOIN, the Ethereum route is the one the bridge supports end to end. Base and Solana usually have lower network fees but stop at vKOIN, because Vortex does not connect those networks to Koinos. The Koinos route is not a way to buy your first KOIN; it is what you use once you already hold some.",
  },
  {
    q: "What is the difference between KOIN and vKOIN?",
    a: "Native KOIN lives on the Koinos blockchain and gives the account mana. vKOIN is a wrapped token on Ethereum, Base or Solana, issued to represent KOIN there. They are separate tokens, and sending one to the other's network does not convert it.",
  },
  {
    q: "Why can I not just start on KoinDX?",
    a: "KoinDX runs on Koinos, and a Koinos account draws its mana from the KOIN it holds. An account with no KOIN has no mana and cannot make any transaction, including its first swap. Something has to arrive first, which is what the bridge is for.",
  },
  {
    q: "Do I have to use the bridge?",
    a: "Only if you want native KOIN. You can hold vKOIN on the network where you bought it without bridging, but then you keep depending on the bridge that issued it, and you get no mana on Koinos.",
  },
  {
    q: "Why do I need to keep some ETH or SOL?",
    a: "Ethereum, Base and Solana charge a network fee for every action, paid in their own asset. You need it to swap, to permit a token, and to start a bridge transfer. If you swap your whole balance you will not be able to do the next step.",
  },
  {
    q: "What will all of this cost?",
    a: "Typically an exchange fee to buy, a withdrawal fee to leave the exchange, a network fee for each transaction, a trading fee on the swap, and the effect of your own order on the price. The amounts change constantly and depend on the services you choose, so read the figures on screen before each confirmation rather than relying on an estimate.",
  },
  {
    q: "I received less than the price I first saw. Why?",
    a: "Prices move while a swap is being prepared, and a large order in a small pool moves the price itself. Before you sign, a swap shows a minimum you should receive for that quote. Treat it as a floor for that attempt, not a guarantee about later ones.",
  },
  {
    q: "My vKOIN is not showing in my wallet. Is it lost?",
    a: "Probably not. Wallets do not always list a token automatically. Check the transaction in the network explorer first. In MetaMask or Rabby you can add the token using the official contract address on this page. Never add a contract address that someone sent you privately.",
  },
  {
    q: "My bridge transfer is pending. Should I start it again?",
    a: "No. Starting again can send a second transfer. Save the source transaction hash. Vortex has a Redeem tab where a transfer can be resumed from that hash if the redeem step did not complete.",
  },
  {
    q: "Can Koinos reverse a transaction for me?",
    a: "No. Blockchain transactions cannot be reversed once confirmed, and Koinos does not control your wallet, your exchange account, the swap site or the bridge. This is why checking before confirming matters so much.",
  },
  {
    q: "How much should I buy?",
    a: "That is your decision, and only you know your situation. Crypto assets can lose value, including all of it. Exchanges, swaps and bridges may also have their own minimum amounts.",
  },
  {
    q: "Is this financial advice?",
    a: "No. This page explains how a technical process works. It does not recommend buying KOIN, and it does not recommend any exchange, wallet, decentralised exchange or bridge named on it.",
  },
];

export const GLOSSARY = [
  ["Address", "A public identifier that receives tokens. Safe to share, but it only works on its own network."],
  ["Bridge", "A service that moves value between two blockchains. Vortex is the bridge between Ethereum and Koinos."],
  ["Connecting a wallet", "Letting a website see your address so it can show your balances. On its own it does not let the site move anything."],
  ["Contract address", "The unique identifier of a token. The only reliable way to tell a real token from a copy."],
  ["DEX", "A decentralised exchange. It swaps tokens straight from your wallet, without holding your funds."],
  ["Gas or network fee", "What a network charges to process a transaction, paid in that network's own asset."],
  ["Liquidity", "How much of a token is available to trade. Low liquidity makes large trades more expensive."],
  ["Mana", "The renewable resource Koinos transactions use. An account's KOIN balance is what gives it mana."],
  ["Native token", "A token that exists on its own blockchain, rather than as a representation elsewhere."],
  ["Price impact", "How much your own order moves the price against you. It grows with the size of the trade."],
  ["Recovery phrase", "The secret words that restore a wallet. Anyone who has them controls the wallet completely."],
  ["Slippage", "How much price movement you accept between requesting a swap and it being processed."],
  ["Spending permission", "Separate consent that lets a contract move a token you already hold, up to a set amount. It stays in place until revoked."],
  ["Transaction hash", "The public reference for a transaction. Use it to look up what happened."],
  ["Wrapped token", "A token on one blockchain issued to represent an asset from another. vKOIN is a wrapped representation of KOIN."],
];

export const DISCLAIMER = [
  "This guide is educational information only. It is not financial, investment, legal or tax advice. KOIN and vKOIN can lose value, including all of it.",
  "Exchanges, wallets, decentralised exchanges and bridges are independent services with their own risks, terms, fees, limits and regional availability. Koinos does not guarantee a price, a quote, an amount received, a completion time, available liquidity, or that any service will keep working. The Vortex bridge states that it is unaudited and may malfunction.",
  "Blockchain transactions cannot be reversed. Before signing anything, check the website address, the network, the token contract, the destination address, the amount and the fees shown on screen. You are responsible for your own wallet security and for the laws that apply where you live.",
];
