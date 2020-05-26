/**
 * # Turnip Filter
 * 
 * @param {number} minimumBells - Minimum number of bells you want to sell for.
 * 
 * Default value is 500 bells.
 * 
 * **Usage:**
 * ```
 * var tf = new TurnipFilter(500);
 * 
 * tf.highlight();
 * 
 * tf.hideLower();
 * ```
 */
class TurnipFilter {
  constructor(minimumBells = 500) {
    this.tiles = Array.from(document.querySelectorAll('p.ml-2'));
    this.minimumBells = minimumBells;
    this.logMeta = {
      baseStyles: 'font-size: 16px; font-weight: bold;',
      prefix: '%c',
    };
    this.regex = /([0-9]+)\s(Bells)/g;

    this.initialise();
  }

  initialise() {
    this._info(`Turnip Filter ready! Minimum bells set to ${this.minimumBells}.`);
    this._info(`
----- Available functions: -----
• highlight -> Changes the style of the tiles of the islands buying turnips for ${this.minimumBells} or above.
• hideLower -> Hides the tiles of the islands buying turnips for below ${this.minimumBells} from the page.
--------------------------------
    `);
  }

  /**
   * Highlights the tiles of the islands buying for the `minimumBells` or above.
   *
   * Logs to the console those islands with the name, bells and queue information.
   */
  highlight() {
    const filteredTiles = this._filterForHigher();
    if (!filteredTiles || !filteredTiles.length) {
      this._error(`No islands found buying for ${this.minimumBells} and above.`);
      return;
    }

    filteredTiles.forEach((tag) => {
      const parent = tag.parentElement.parentElement.parentElement;

      if (parent) {
        const queueInfo = this._getQueueInfo(parent);
        const islandName = this._getIslandName(parent);
        parent.setAttribute('style', 'background-color: #011B8E;');
        this._info(`Island: ${islandName} | Buying for: ${tag.innerText} | Queue information: ${queueInfo}.`);
      }    
  
      tag.setAttribute('style', 'background-color: yellow; color: black;');
    });
  }

  /**
   * Hides the tiles of the islands buying for below `minimumBells`.
   */
  hideLower() {
    const filteredTiles = this._filterForLower();
    if (!filteredTiles || !filteredTiles.length) {
      this._error(`No islands found buying for below ${this.minimumBells}.`);
      return;
    }

    filteredTiles.forEach((tag) => {
      const parent = tag.parentElement.parentElement.parentElement;
      if (parent) parent.setAttribute('style', 'display: none;');  
    });
    this._info(`Hidden islands lower than ${this.minimumBells}.`);
  }

  _filterForHigher() {
    if (!this.tiles || !this.tiles.length) return;

    return this.tiles.filter((tag) => {
      if (!tag.innerText) return false;

      const bellsString = tag.innerText.match(this.regex);
      if (!bellsString || !bellsString.length) return false;

      const number = parseInt(bellsString[0].split(' ')[0]);
      return number >= this.minimumBells;
    });
  }

  _filterForLower() {
    if (!this.tiles || !this.tiles.length) return;

    return this.tiles.filter((tag) => {
      if (!tag.innerText) return false;

      const bellsString = tag.innerText.match(this.regex);
      if (!bellsString || !bellsString.length) return false;

      const number = parseInt(bellsString[0].split(' ')[0]);
      return number < this.minimumBells;
    });
  }

  _getIslandName(tileParentTag) {
    const islandNameNode = tileParentTag.querySelectorAll('p.font-poster')[0];
    if (!islandNameNode) return '-';

    return islandNameNode.innerText;
  }

  _getQueueInfo(parent) {
    const queueInfoNode = parent.querySelectorAll('p.text-xs.col-start-2.justify-self-end.italic.mr-1')[0];
    return queueInfoNode.innerText.split(' ')[1] || '-';
  }

  _info(...params) {
    const styles = `color: #032FA0; ${this.logMeta.baseStyles}`;
    console.info(`${this.logMeta.prefix}${params}`, styles);
  }

  _error(...params) {
    const styles = `color: #960E22; ${this.logMeta.baseStyles}`;
    console.info(`${this.logMeta.prefix}${params}`, styles);
  }
}
