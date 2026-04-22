const { TextBoxElement } = require('./text-box-element');

/**
 * Terminal element (quoted literals, hex values, etc.)
 * @extends TextBoxElement
 */
class TerminalElement extends TextBoxElement {
    /**
     * Create a terminal expression
     * @param {string} text - Text to display in the box (literal ABNF syntax)
     * @param {string} [label] - Optional label to display below the terminal
     */
    constructor(text, label = null) {
        super(text, 'terminal');
        this.label = label;
    }

    /**
     * Override render to include label below terminal box
     * @param {RenderContext} ctx - Rendering context
     * @returns {void}
     */
    render(ctx) {
        // Call parent render to draw the terminal box
        super.render(ctx);
        
        // Add label to the right of the terminal for annotated char alternatives.
        if (this.label) {
            const labelFontSize = 10;
            const labelPadding = 12;
            const boxHeightPixels = 2 * ctx.gridSize;

            const labelX = this.width * ctx.gridSize + labelPadding;
            const labelY = boxHeightPixels / 2 - 6;

            ctx.svg += `<text x="${labelX}" y="${labelY}" text-anchor="start" dominant-baseline="middle" class="terminal-label" font-size="${labelFontSize}" fill="#555">${ctx.escapeXml(this.label)}</text>`;
        }
    }

    /**
     * Convert to debug string representation
     * @returns {string} Debug string like 'terminal("x")'
     */
    toString() {
        return `terminal(${JSON.stringify(this.text)}${this.label ? `, label: ${JSON.stringify(this.label)}` : ''})`;
    }
}

module.exports = TerminalElement;