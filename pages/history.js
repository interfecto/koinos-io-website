import Layout from "@/components/layout/Layout";
import historyContent from "@/data/history-content.json";
import Head from "next/head";
import { useMemo, useRef, useState } from "react";
import { flushSync } from "react-dom";
import styles from "@/styles/History.module.css";

const ERAS = [
  {
    id: "origins",
    label: "Origins",
    years: "2016—2020",
    number: "01",
    summary:
      "The story begins with the Steem lesson, the formation of OpenOrchard and Koinos Group, the fair-launch mining period, and the first international community branches.",
  },
  {
    id: "building",
    label: "From token to chain",
    years: "2021—2022",
    number: "02",
    summary:
      "Testnets, wallets, SDKs, pools, standards, the decentralized claim, and mainnet turn KOIN from a mined token into a working blockchain.",
  },
  {
    id: "ecosystem",
    label: "An ecosystem emerges",
    years: "2023",
    number: "03",
    summary:
      "Independent builders expand Koinos with wallets, exchanges, bridges, NFTs, social tools, education, and the first community-led institutions.",
  },
  {
    id: "evolution",
    label: "Growth & governance",
    years: "2024",
    number: "04",
    summary:
      "The network shifts toward developer experience, product maturity, public governance, and community funding while leadership and responsibilities change.",
  },
  {
    id: "continuity",
    label: "Community continuity",
    years: "2025—2026",
    number: "05",
    summary:
      "Developers, operators, the Foundation, and funded community projects preserve the chain and carry its infrastructure into its next chapter.",
  },
];

const PEOPLE_SUMMARY = {
  label: "Main characters",
  summary:
    "Meet the founders, architects, builders, operators, designers, educators, and advocates whose decisions and work shaped the chain.",
};

const EVENTS = historyContent.events;
const MARKETING_REPOSITORY =
  "https://github.com/pgarciagon/marketing/blob/main/";
const PEOPLE_SOURCE = EVENTS.find(
  (event) => event.title === "Koinos Group LLC Is Registered"
);

function parsePerson(item) {
  const match = item.match(/^\*\*(.+?)\*\*:\s*(.*)$/s);
  return match
    ? { name: match[1], description: match[2] }
    : { name: item, description: "" };
}

function plainPersonName(name) {
  return name.replace(/[`*_]/g, "").trim();
}

function personSortKey(person) {
  return plainPersonName(person.name).replace(/^@/, "");
}

const PEOPLE = PEOPLE_SOURCE.content
  .filter((block) => block.type === "unordered-list")
  .flatMap((block) => block.items.map(parsePerson))
  .sort((personA, personB) =>
    personSortKey(personA).localeCompare(personSortKey(personB), "en", {
      sensitivity: "base",
    })
  );
const PEOPLE_COUNT = PEOPLE.length;
const PEOPLE_WHEEL_ITEMS = PEOPLE.map((person, index) => ({
  id: `person-${index + 1}`,
  title: plainPersonName(person.name),
  date: `${personSortKey(person).charAt(0).toUpperCase()} · ${String(
    index + 1
  ).padStart(2, "0")}`,
  person,
}));

function resolveArticleHref(href) {
  if (/^(https?:\/\/|mailto:|#)/.test(href)) return href;
  return `${MARKETING_REPOSITORY}${href.replace(/^\.\//, "")}`;
}

function renderInline(text, keyPrefix = "inline") {
  const nodes = [];
  const pattern = /(\[([^\]]+)\]\(([^)]+)\)|\*\*([^*]+)\*\*|`([^`]+)`|\*([^*]+)\*)/g;
  let cursor = 0;
  let match;
  let tokenIndex = 0;

  while ((match = pattern.exec(text)) !== null) {
    if (match.index > cursor) {
      nodes.push(text.slice(cursor, match.index));
    }

    const key = `${keyPrefix}-${tokenIndex}`;
    if (match[2] !== undefined) {
      nodes.push(
        <a
          key={key}
          href={resolveArticleHref(match[3])}
          target="_blank"
          rel="noreferrer"
        >
          {renderInline(match[2], `${key}-label`)}
        </a>
      );
    } else if (match[4] !== undefined) {
      nodes.push(
        <strong key={key}>{renderInline(match[4], `${key}-strong`)}</strong>
      );
    } else if (match[5] !== undefined) {
      nodes.push(<code key={key}>{match[5]}</code>);
    } else if (match[6] !== undefined) {
      nodes.push(<em key={key}>{renderInline(match[6], `${key}-em`)}</em>);
    }

    cursor = pattern.lastIndex;
    tokenIndex += 1;
  }

  if (cursor < text.length) nodes.push(text.slice(cursor));
  return nodes;
}

function ArticleBody({ event }) {
  return (
    <div className={styles.articleBody}>
      {event.content.map((block, blockIndex) => {
        const key = `${event.id}-${blockIndex}`;

        if (block.type === "image") {
          return (
            <figure key={key} className={styles.articleFigure}>
              <img src={block.src} alt={block.alt || event.title} loading="lazy" />
              {block.caption ? (
                <figcaption>{renderInline(block.caption, `${key}-caption`)}</figcaption>
              ) : null}
            </figure>
          );
        }

        if (block.type === "unordered-list" || block.type === "ordered-list") {
          const ListTag = block.type === "ordered-list" ? "ol" : "ul";
          return (
            <ListTag key={key}>
              {block.items.map((item, itemIndex) => (
                <li key={`${key}-${itemIndex}`}>
                  {renderInline(item, `${key}-${itemIndex}`)}
                </li>
              ))}
            </ListTag>
          );
        }

        if (block.type === "quote") {
          return (
            <blockquote key={key}>{renderInline(block.text, key)}</blockquote>
          );
        }

        return <p key={key}>{renderInline(block.text, key)}</p>;
      })}
    </div>
  );
}

export default function HistoryPage() {
  const originEvents = EVENTS.filter((event) => event.era === "origins");
  const [activeEra, setActiveEra] = useState("origins");
  const [focusedId, setFocusedId] = useState(originEvents[0].id);
  const [openedId, setOpenedId] = useState(null);
  const [peopleSelected, setPeopleSelected] = useState(false);
  const wheelRef = useRef(null);
  const wheelNodes = useRef({});
  const wheelScrollTimer = useRef(null);
  const wheelDrag = useRef({ active: false, startX: 0, scrollLeft: 0 });
  const didWheelDrag = useRef(false);
  const readerRef = useRef(null);

  const chapterEvents = useMemo(
    () => EVENTS.filter((event) => event.era === activeEra),
    [activeEra]
  );
  const activeEraDetails = ERAS.find((era) => era.id === activeEra);
  const selectedChapter = peopleSelected ? PEOPLE_SUMMARY : activeEraDetails;
  const wheelItems = peopleSelected ? PEOPLE_WHEEL_ITEMS : chapterEvents;
  const focusedIndex = Math.max(
    0,
    wheelItems.findIndex((item) => item.id === focusedId)
  );
  const focusedItem = wheelItems[focusedIndex];
  const openedEvent = !peopleSelected && openedId
    ? EVENTS.find((event) => event.id === openedId)
    : null;
  const openedPerson = peopleSelected && openedId
    ? PEOPLE_WHEEL_ITEMS.find((item) => item.id === openedId)
    : null;
  const openedItem = openedPerson || openedEvent;
  const openedIndex = openedItem
    ? wheelItems.findIndex((item) => item.id === openedItem.id)
    : -1;
  const previousOpenedTarget =
    openedIndex >= 0 ? getAdjacentTarget(openedIndex, -1) : null;
  const nextOpenedTarget =
    openedIndex >= 0 ? getAdjacentTarget(openedIndex, 1) : null;

  function getAdjacentTarget(fromIndex, direction) {
    const adjacentIndex = fromIndex + direction;
    if (adjacentIndex >= 0 && adjacentIndex < wheelItems.length) {
      return {
        item: wheelItems[adjacentIndex],
        crossesChapter: false,
        eraId: activeEra,
      };
    }

    if (peopleSelected) {
      const wrappedIndex =
        (adjacentIndex + wheelItems.length) % wheelItems.length;
      return {
        item: wheelItems[wrappedIndex],
        crossesChapter: false,
        eraId: activeEra,
      };
    }

    const activeEraIndex = ERAS.findIndex((era) => era.id === activeEra);
    const adjacentEra =
      ERAS[(activeEraIndex + direction + ERAS.length) % ERAS.length];
    const adjacentEvents = EVENTS.filter(
      (event) => event.era === adjacentEra.id
    );

    return {
      item:
        direction > 0
          ? adjacentEvents[0]
          : adjacentEvents[adjacentEvents.length - 1],
      crossesChapter: true,
      eraId: adjacentEra.id,
    };
  }

  function scrollWheelTo(id, behavior = "smooth") {
    window.requestAnimationFrame(() => {
      const track = wheelRef.current;
      const node = wheelNodes.current[id];
      if (!track || !node) return;

      const centeredLeft =
        node.offsetLeft + node.offsetWidth / 2 - track.clientWidth / 2;
      track.scrollTo({ left: centeredLeft, behavior });
    });
  }

  function focusWheelItem(id, behavior = "smooth") {
    flushSync(() => {
      setFocusedId(id);
      setOpenedId(null);
    });
    scrollWheelTo(id, behavior);
  }

  function focusAndRevealItem(id) {
    focusWheelItem(id, "auto");
    window.requestAnimationFrame(() => {
      window.requestAnimationFrame(() => {
        revealItem(
          id,
          wheelNodes.current[id]?.querySelector(`.${styles.wheelDateTitle}`)
        );
      });
    });
  }

  function revealItem(id, sourceTitle) {
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    const sourceRect = sourceTitle?.getBoundingClientRect();
    const sourceStyle = sourceTitle ? window.getComputedStyle(sourceTitle) : null;

    flushSync(() => setOpenedId(id));

    const targetTitle = readerRef.current?.querySelector("h2");
    if (
      prefersReducedMotion ||
      !sourceTitle ||
      !sourceRect ||
      !sourceStyle ||
      !targetTitle
    ) {
      window.requestAnimationFrame(() => {
        readerRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
      });
      return;
    }

    const targetRect = targetTitle.getBoundingClientRect();
    const targetStyle = window.getComputedStyle(targetTitle);
    const flyingTitle = document.createElement("div");
    flyingTitle.textContent = sourceTitle.textContent;
    flyingTitle.setAttribute("aria-hidden", "true");
    Object.assign(flyingTitle.style, {
      position: "fixed",
      zIndex: "2147483000",
      top: `${sourceRect.top}px`,
      left: `${sourceRect.left}px`,
      width: `${sourceRect.width}px`,
      margin: "0",
      color: targetStyle.color,
      fontFamily: targetStyle.fontFamily,
      fontSize: sourceStyle.fontSize,
      fontWeight: targetStyle.fontWeight,
      letterSpacing: sourceStyle.letterSpacing,
      lineHeight: sourceStyle.lineHeight,
      textAlign: "center",
      pointerEvents: "none",
      transformOrigin: "top left",
      transition:
        "top 760ms cubic-bezier(0.18, 0.82, 0.2, 1), left 760ms cubic-bezier(0.18, 0.82, 0.2, 1), width 760ms cubic-bezier(0.18, 0.82, 0.2, 1), font-size 760ms cubic-bezier(0.18, 0.82, 0.2, 1), letter-spacing 760ms cubic-bezier(0.18, 0.82, 0.2, 1), line-height 760ms cubic-bezier(0.18, 0.82, 0.2, 1)",
    });

    targetTitle.style.visibility = "hidden";
    document.body.appendChild(flyingTitle);

    const finishAnimation = () => {
      targetTitle.style.visibility = "";
      flyingTitle.remove();
      readerRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    };

    flyingTitle.getBoundingClientRect();
    window.requestAnimationFrame(() => {
      Object.assign(flyingTitle.style, {
        top: `${targetRect.top}px`,
        left: `${targetRect.left}px`,
        width: `${targetRect.width}px`,
        fontSize: targetStyle.fontSize,
        letterSpacing: targetStyle.letterSpacing,
        lineHeight: targetStyle.lineHeight,
      });
    });
    window.setTimeout(finishAnimation, 820);
  }

  function chooseEra(eraId) {
    const firstEvent = EVENTS.find((event) => event.era === eraId);
    window.clearTimeout(wheelScrollTimer.current);
    flushSync(() => {
      setPeopleSelected(false);
      setActiveEra(eraId);
      setFocusedId(firstEvent.id);
      setOpenedId(null);
    });
    scrollWheelTo(firstEvent.id, "auto");
  }

  function openPeople() {
    window.clearTimeout(wheelScrollTimer.current);
    flushSync(() => {
      setPeopleSelected(true);
      setFocusedId(PEOPLE_WHEEL_ITEMS[0].id);
      setOpenedId(null);
    });
    scrollWheelTo(PEOPLE_WHEEL_ITEMS[0].id, "auto");
  }

  function activateAdjacentTarget(target, openItem = false) {
    if (!target.crossesChapter) {
      if (!openItem) {
        focusWheelItem(target.item.id);
        return;
      }

      flushSync(() => {
        setFocusedId(target.item.id);
        setOpenedId(target.item.id);
      });
      scrollWheelTo(target.item.id);
    } else {
      window.clearTimeout(wheelScrollTimer.current);
      flushSync(() => {
        setPeopleSelected(false);
        setActiveEra(target.eraId);
        setFocusedId(target.item.id);
        setOpenedId(openItem ? target.item.id : null);
      });
      scrollWheelTo(target.item.id, "auto");
    }

    if (openItem) {
      window.requestAnimationFrame(() => {
        readerRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
      });
    }
  }

  function stepWheel(direction) {
    activateAdjacentTarget(getAdjacentTarget(focusedIndex, direction));
  }

  function updateWheelGeometry() {
    const track = wheelRef.current;
    if (!track) return;

    const trackCenter = track.scrollLeft + track.clientWidth / 2;
    wheelItems.forEach((item) => {
      const node = wheelNodes.current[item.id];
      if (!node) return;

      const nodeCenter = node.offsetLeft + node.offsetWidth / 2;
      const distance = Math.abs(nodeCenter - trackCenter) / node.offsetWidth;
      node.style.setProperty(
        "--arc-y",
        `${Math.min(88, distance * distance * 7)}px`
      );
      node.style.setProperty(
        "--arc-scale",
        Math.max(0.72, 1 - distance * 0.08)
      );
      node.style.setProperty(
        "--arc-opacity",
        Math.max(0.16, 1 - distance * 0.22)
      );
    });
  }

  function handleWheelScroll() {
    updateWheelGeometry();
    window.clearTimeout(wheelScrollTimer.current);
    wheelScrollTimer.current = window.setTimeout(() => {
      const track = wheelRef.current;
      if (!track) return;

      const trackCenter = track.scrollLeft + track.clientWidth / 2;
      let nearestItem = null;
      let nearestDistance = Number.POSITIVE_INFINITY;

      wheelItems.forEach((item) => {
        const node = wheelNodes.current[item.id];
        if (!node) return;
        const nodeCenter = node.offsetLeft + node.offsetWidth / 2;
        const distance = Math.abs(nodeCenter - trackCenter);
        if (distance < nearestDistance) {
          nearestDistance = distance;
          nearestItem = item;
        }
      });

      if (nearestItem && nearestItem.id !== focusedId) {
        setFocusedId(nearestItem.id);
        setOpenedId(null);
      }
    }, 100);
  }

  function handleWheelPointerDown(event) {
    if (event.pointerType !== "mouse" || event.button !== 0) return;
    const track = wheelRef.current;
    wheelDrag.current = {
      active: true,
      startX: event.clientX,
      scrollLeft: track.scrollLeft,
    };
    didWheelDrag.current = false;
  }

  function handleWheelPointerMove(event) {
    if (!wheelDrag.current.active) return;
    const track = wheelRef.current;
    const distance = event.clientX - wheelDrag.current.startX;
    if (Math.abs(distance) > 12 && !didWheelDrag.current) {
      didWheelDrag.current = true;
      track.setPointerCapture(event.pointerId);
    }
    if (didWheelDrag.current) {
      track.scrollLeft = wheelDrag.current.scrollLeft - distance;
      updateWheelGeometry();
    }
  }

  function handleWheelPointerEnd(event) {
    if (!wheelDrag.current.active) return;
    wheelDrag.current.active = false;
    if (wheelRef.current.hasPointerCapture(event.pointerId)) {
      wheelRef.current.releasePointerCapture(event.pointerId);
    }
  }

  function handleWheelItemClick(event, item, isFocused) {
    if (didWheelDrag.current) {
      didWheelDrag.current = false;
      event.preventDefault();
      return;
    }
    if (isFocused) {
      revealItem(
        item.id,
        event.currentTarget.querySelector(`.${styles.wheelDateTitle}`)
      );
    } else {
      focusAndRevealItem(item.id);
    }
  }

  function openAdjacentItem(direction) {
    if (openedIndex < 0) return;
    activateAdjacentTarget(
      getAdjacentTarget(openedIndex, direction),
      true
    );
  }

  function renderReaderNavigation(position) {
    if (!openedItem) return null;

    return (
      <nav
        className={`${styles.readerFooter} ${
          position === "top" ? styles.readerNavigationTop : ""
        }`}
        aria-label={`${
          peopleSelected ? "Main character" : "Milestone"
        } navigation at the ${position}`}
      >
        <button type="button" onClick={() => openAdjacentItem(-1)}>
          <span aria-hidden="true">←</span>
          <span>
            <small>
              {peopleSelected
                ? "Previous person"
                : previousOpenedTarget.crossesChapter
                  ? "Previous chapter"
                  : "Previous milestone"}
            </small>
            <strong>{previousOpenedTarget.item.title}</strong>
          </span>
        </button>
        <button type="button" onClick={() => openAdjacentItem(1)}>
          <span>
            <small>
              {peopleSelected
                ? "Next person"
                : nextOpenedTarget.crossesChapter
                  ? "Next chapter"
                  : "Next milestone"}
            </small>
            <strong>{nextOpenedTarget.item.title}</strong>
          </span>
          <span aria-hidden="true">→</span>
        </button>
      </nav>
    );
  }

  return (
    <Layout
      headerStyle={1}
      footerStyle={1}
      headerCls="navbar-dark light-hero-header"
      headTitle="Brief History of Koinos"
    >
      <Head>
        <meta
          name="description"
          content="Explore the lived history of Koinos—from its Steem roots and fair launch to mainnet and community continuity."
        />
        <meta property="og:title" content="Brief History of Koinos | An Interactive Chronicle" />
        <meta
          property="og:description"
          content="A decade of people, software, conflict, experiments, and continuity—made explorable."
        />
      </Head>

      <div className={styles.page}>
        <section className={styles.hero} aria-labelledby="history-title">
          <div className={styles.heroGrid}>
            <div className={styles.heroCopy}>
              <p className={styles.eyebrow}>An interactive chronicle · 2016—2026</p>
              <h1 id="history-title" className={styles.heroTitle}>
                Brief history
                <span>of Koinos.</span>
              </h1>
              <p className={styles.heroLead}>
                Code can be copied. Architecture can be reproduced. But a lived
                blockchain—its people, choices, failures, and continuity—cannot
                be recreated.
              </p>
              <div className={styles.heroActions}>
                <a className={styles.primaryAction} href="#chronicle">
                  Enter the chronicle
                  <span aria-hidden="true">↓</span>
                </a>
              </div>
            </div>

            <div className={styles.heroArtifact} aria-hidden="true">
              <div className={`${styles.orbit} ${styles.orbitOuter}`} />
              <div className={`${styles.orbit} ${styles.orbitMiddle}`} />
              <div className={`${styles.orbit} ${styles.orbitInner}`} />
              <span className={`${styles.orbitNode} ${styles.nodeOne}`} />
              <span className={`${styles.orbitNode} ${styles.nodeTwo}`} />
              <span className={`${styles.orbitNode} ${styles.nodeThree}`} />
              <span className={`${styles.orbitYear} ${styles.yearStart}`}>2016</span>
              <span className={`${styles.orbitYear} ${styles.yearMiddle}`}>2022</span>
              <span className={`${styles.orbitYear} ${styles.yearEnd}`}>2026</span>
              <div className={styles.artifactCore}>
                <img src="/images/logo/svg/koinos-logomark-black.svg" alt="" />
                <span>LIVED<br />HISTORY</span>
              </div>
            </div>
          </div>

          <div className={styles.heroIndex} aria-label="Chronicle overview">
            <div>
              <strong>10+</strong>
              <span>years of history</span>
            </div>
            <div>
              <strong>{EVENTS.length}</strong>
              <span>documented milestones</span>
            </div>
            <div>
              <strong>{PEOPLE_COUNT}</strong>
              <span>people in the history</span>
            </div>
            <div>
              <strong>1</strong>
              <span>continuous living chain</span>
            </div>
          </div>
        </section>

        <section
          id="chronicle"
          className={`${styles.chronicle} ${
            openedItem ? "" : styles.chronicleCompact
          }`}
          aria-labelledby="chronicle-title"
        >
          <div className={styles.sectionIntro}>
            <p className={styles.eyebrow}>The chronology</p>
            <h2 id="chronicle-title">Turn the wheel of time.</h2>
            <div
              key={peopleSelected ? "people" : activeEra}
              className={styles.chapterSummary}
              aria-live="polite"
            >
              <span>
                {peopleSelected
                  ? `${PEOPLE_COUNT} documented people`
                  : `Chapter ${activeEraDetails.number} · ${activeEraDetails.years} · ${chapterEvents.length} milestones`}
              </span>
              <h3>{selectedChapter.label}</h3>
              <p>{selectedChapter.summary}</p>
            </div>
          </div>

          <div className={styles.eraRail} role="tablist" aria-label="Historical chapters">
            <button
              type="button"
              role="tab"
              aria-selected={peopleSelected}
              className={`${styles.eraButton} ${
                peopleSelected ? styles.eraButtonActive : ""
              }`}
              onClick={openPeople}
            >
              <span className={styles.eraNumber}>People</span>
              <span className={styles.eraName}>Main characters</span>
              <span className={styles.eraYears}>Behind the story</span>
              <span className={styles.eraCount}>{PEOPLE_COUNT}</span>
            </button>
            {ERAS.map((era) => {
              const count = EVENTS.filter((event) => event.era === era.id).length;
              return (
                <button
                  key={era.id}
                  type="button"
                  role="tab"
                  aria-selected={!peopleSelected && activeEra === era.id}
                  className={`${styles.eraButton} ${
                    !peopleSelected && activeEra === era.id
                      ? styles.eraButtonActive
                      : ""
                  }`}
                  onClick={() => chooseEra(era.id)}
                >
                  <span className={styles.eraNumber}>{era.number}</span>
                  <span className={styles.eraName}>{era.label}</span>
                  <span className={styles.eraYears}>{era.years}</span>
                  <span className={styles.eraCount}>{count}</span>
                </button>
              );
            })}
          </div>

          <div
            key={peopleSelected ? "people" : activeEra}
            className={styles.wheelStage}
          >
            <div className={styles.wheelHeader}>
              <div className={styles.wheelControls}>
                <button
                  type="button"
                  onClick={() => stepWheel(-1)}
                  aria-label={peopleSelected ? "Previous person" : "Previous date"}
                >
                  ←
                </button>
                <span>
                  {String(focusedIndex + 1).padStart(2, "0")} / {wheelItems.length}
                </span>
                <button
                  type="button"
                  onClick={() => stepWheel(1)}
                  aria-label={peopleSelected ? "Next person" : "Next date"}
                >
                  →
                </button>
              </div>
            </div>

            <div className={styles.wheelViewport}>
              <div className={styles.wheelArc} aria-hidden="true" />
              <ol
                ref={wheelRef}
                className={styles.wheelTrack}
                aria-label={
                  peopleSelected
                    ? "Main characters in alphabetical order"
                    : `${activeEraDetails.label} milestone dates`
                }
                onScroll={handleWheelScroll}
                onPointerDown={handleWheelPointerDown}
                onPointerMove={handleWheelPointerMove}
                onPointerUp={handleWheelPointerEnd}
                onPointerCancel={handleWheelPointerEnd}
              >
                {wheelItems.map((item, index) => {
                  const distance = Math.abs(index - focusedIndex);
                  const arcY = Math.min(88, distance * distance * 7);
                  const scale = Math.max(0.72, 1 - distance * 0.08);
                  const opacity = Math.max(0.16, 1 - distance * 0.22);
                  const isFocused = item.id === focusedItem.id;

                  return (
                    <li key={item.id}>
                      <button
                        ref={(node) => {
                          wheelNodes.current[item.id] = node;
                        }}
                        type="button"
                        aria-pressed={isFocused}
                        aria-label={
                          peopleSelected
                            ? `Main character: ${item.title}`
                            : `${item.date}: ${item.title}`
                        }
                        className={`${styles.wheelDate} ${
                          isFocused ? styles.wheelDateActive : ""
                        }`}
                        style={{
                          "--arc-y": `${arcY}px`,
                          "--arc-scale": scale,
                          "--arc-opacity": opacity,
                        }}
                        onClick={(clickEvent) =>
                          handleWheelItemClick(clickEvent, item, isFocused)
                        }
                      >
                        <strong className={styles.wheelDateTitle}>
                          {item.title}
                        </strong>
                        <span>{item.date}</span>
                        <i aria-hidden="true" />
                      </button>
                    </li>
                  );
                })}
              </ol>
            </div>

          </div>

          {openedItem ? (
            <section
              key={openedItem.id}
              ref={readerRef}
              className={styles.reader}
              aria-labelledby={`reader-${openedItem.id}`}
            >
              {renderReaderNavigation("top")}

              <header className={styles.readerHeader}>
                <div className={styles.readerMeta}>
                  <span>{openedItem.date}</span>
                </div>
                <h2 id={`reader-${openedItem.id}`}>{openedItem.title}</h2>
                <div className={styles.readerByline}>
                  <span>
                    Entry {String(openedIndex + 1).padStart(2, "0")} of {wheelItems.length}
                    {" "}in {selectedChapter.label}
                  </span>
                  {openedEvent ? (
                    <a href={openedEvent.sourceUrl} target="_blank" rel="noreferrer">
                      View source entry <span aria-hidden="true">↗</span>
                    </a>
                  ) : null}
                </div>
              </header>

              {openedPerson ? (
                <div className={styles.articleBody}>
                  <p>
                    {renderInline(
                      openedPerson.person.description,
                      `${openedPerson.id}-description`
                    )}
                  </p>
                </div>
              ) : (
                <ArticleBody event={openedEvent} />
              )}

              {renderReaderNavigation("bottom")}
            </section>
          ) : null}
        </section>

        <section
          id="people"
          className={`${styles.people} ${peopleSelected ? styles.peopleOpen : ""}`}
          aria-labelledby="people-title"
        >
          <div className={styles.peopleIntro}>
            <div>
              <p className={styles.eyebrow}>The main characters</p>
              <h2 id="people-title">The people behind the story.</h2>
            </div>
            <div className={styles.peopleIntroCopy}>
              <strong>{PEOPLE_COUNT} documented people</strong>
              <p>
                These are the founders, architects, builders, operators,
                designers, educators, and advocates named in the chronicle,
                presented together in alphabetical order.
              </p>
            </div>
          </div>

          <section
            className={styles.peopleGroup}
            aria-label="People in alphabetical order"
          >
            <ol className={styles.peopleList}>
              {PEOPLE.map((person, personIndex) => (
                <li key={person.name} className={styles.person}>
                  <span className={styles.personNumber}>
                    {String(personIndex + 1).padStart(2, "0")}
                  </span>
                  <h4>{renderInline(person.name, `person-${personIndex}-name`)}</h4>
                  <p>
                    {renderInline(
                      person.description,
                      `person-${personIndex}-description`
                    )}
                  </p>
                </li>
              ))}
            </ol>
          </section>
        </section>

        <section className={styles.closing} aria-labelledby="closing-title">
          <p className={styles.eyebrow}>Why history matters</p>
          <h2 id="closing-title">
            A chain is more than the code that runs it.
          </h2>
          <div className={styles.closingStatements}>
            <p><span>01</span> You can fork the architecture.</p>
            <p><span>02</span> You cannot fork the choices that shaped it.</p>
            <p><span>03</span> You cannot recreate the people who kept it alive.</p>
          </div>
          <a href={historyContent.sourceUrl} target="_blank" rel="noreferrer">
            Continue with the complete sourced chronicle <span aria-hidden="true">↗</span>
          </a>
        </section>
      </div>
    </Layout>
  );
}
