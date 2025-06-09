const createSvg = (text) => {
  let icon = `
<svg width="114" height="114" viewBox="0 0 114 114" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M102.621 0.880005H10.853C5.2216 0.880005 0.656494 7.15703 0.656494 14.9002V99.0211C0.656494 106.764 5.2216 113.041 10.853 113.041H102.621C108.253 113.041 112.818 106.764 112.818 99.0211V14.9002C112.818 7.15703 108.253 0.880005 102.621 0.880005Z" fill="url(#paint0_linear_28_22)"/>
<path fill-rule="evenodd" clip-rule="evenodd" d="M102.652 0.880005H10.8229C9.46988 0.880005 8.16834 1.19906 6.91832 1.83718C5.66827 2.4753 4.56489 3.3839 3.60815 4.563L49.5227 61.1484C50.4791 62.3272 51.5825 63.2358 52.8325 63.8738C54.0826 64.5122 55.3841 64.8316 56.7373 64.8316C58.0901 64.8316 59.3916 64.5122 60.642 63.8738C61.8917 63.2358 62.9951 62.3272 63.9519 61.1484L109.866 4.56297C108.91 3.38389 107.806 2.47529 106.556 1.83718C105.306 1.19906 104.005 0.880005 102.652 0.880005Z" fill="url(#paint1_linear_28_22)"/>
<defs>
<linearGradient id="paint0_linear_28_22" x1="56.7371" y1="0.880005" x2="56.7371" y2="113.041" gradientUnits="userSpaceOnUse">
<stop stop-color="#FAC227"/>
<stop offset="1" stop-color="#FAA627"/>
</linearGradient>
<linearGradient id="paint1_linear_28_22" x1="56.738" y1="0.880005" x2="56.738" y2="64.8316" gradientUnits="userSpaceOnUse">
<stop stop-color="#FCE4B1"/>
<stop offset="1" stop-color="#FFD272"/>
</linearGradient>
</defs>
</svg>
`

  if (text !== '0') {
    icon = `<svg width="114" height="114" viewBox="0 0 114 114" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M102.621 0.880005H10.853C5.2216 0.880005 0.656494 7.15703 0.656494 14.9002V99.0211C0.656494 106.764 5.2216 113.041 10.853 113.041H102.621C108.253 113.041 112.818 106.764 112.818 99.0211V14.9002C112.818 7.15703 108.253 0.880005 102.621 0.880005Z" fill="url(#paint0_linear_28_22)"/>
<path fill-rule="evenodd" clip-rule="evenodd" d="M102.652 0.880005H10.8229C9.46988 0.880005 8.16834 1.19906 6.91832 1.83718C5.66827 2.4753 4.56489 3.3839 3.60815 4.563L49.5227 61.1484C50.4791 62.3272 51.5825 63.2358 52.8325 63.8738C54.0826 64.5122 55.3841 64.8316 56.7373 64.8316C58.0901 64.8316 59.3916 64.5122 60.642 63.8738C61.8917 63.2358 62.9951 62.3272 63.9519 61.1484L109.866 4.56297C108.91 3.38389 107.806 2.47529 106.556 1.83718C105.306 1.19906 104.005 0.880005 102.652 0.880005Z" fill="url(#paint1_linear_28_22)"/>
<circle cx="57" cy="57" r="33" fill="#EF0034"/>
     <text x="57" y="69" font-family="Tahoma" font-weight="bold" font-size="32" fill="white" text-anchor="middle" stroke-width="0" paint-order="stroke">
       ${text}
    </text>
<defs>
<linearGradient id="paint0_linear_28_22" x1="56.7371" y1="0.880005" x2="56.7371" y2="113.041" gradientUnits="userSpaceOnUse">
<stop stop-color="#FAC227"/>
<stop offset="1" stop-color="#FAA627"/>
</linearGradient>
<linearGradient id="paint1_linear_28_22" x1="56.738" y1="0.880005" x2="56.738" y2="64.8316" gradientUnits="userSpaceOnUse">
<stop stop-color="#FCE4B1"/>
<stop offset="1" stop-color="#FFD272"/>
</linearGradient>
</defs>
</svg>`
  }

  if (text == 'ERR') {
    icon = `<svg version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px"
	 viewBox="0 0 512 512" style="enable-background:new 0 0 512 512;" xml:space="preserve">
<circle style="fill:#E04F5F;" cx="256" cy="256" r="256"/>
<g>
	<path style="fill:#FFFFFF;" d="M147.592,316v-34.496h-61.48v-16.728l55.416-84.688h30.32v81.968h17.568v19.448h-17.568V316H147.592
		z M147.592,262.056V225.04c0-7.736,0.208-15.68,0.832-23.632h-0.832c-4.176,8.576-7.736,15.472-11.912,23l-24.88,37.224
		l-0.208,0.416h37V262.056z"/>
	<path style="fill:#FFFFFF;" d="M298.976,247.208c0,43.696-17.144,71.088-49.552,71.088c-31.368,0-48.096-28.44-48.304-69.832
		c0-42.24,17.984-70.672,49.768-70.672C283.712,177.784,298.976,207.056,298.976,247.208z M227.048,248.464
		c-0.208,33.04,8.992,50.176,23.208,50.176c15.056,0,23-18.4,23-51.016c0-31.576-7.52-50.184-23-50.184
		C236.456,197.44,226.832,214.376,227.048,248.464z"/>
	<path style="fill:#FFFFFF;" d="M371.736,316v-34.496h-61.48v-16.728l55.416-84.688h30.32v81.968h17.568v19.448h-17.568V316H371.736
		z M371.736,262.056V225.04c0-7.736,0.208-15.68,0.832-23.632h-0.832c-4.176,8.576-7.736,15.472-11.912,23l-24.88,37.224
		l-0.208,0.416h37V262.056z"/>
</g>
</svg>`
  }

  return icon
}

module.exports = createSvg;