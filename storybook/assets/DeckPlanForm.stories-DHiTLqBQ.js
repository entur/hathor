import{i as e,s as t}from"./preload-helper-xPQekRTU.js";import{$ as n,_t as r,at as i,d as a,dt as o,in as s,j as c,k as l,kt as u,l as d,o as f,pt as p,r as m,st as h,t as g,tt as _}from"./iframe-D7q1UzBu.js";import{i as ee,n as te,t as ne}from"./FormLayout-B0P9ohtJ.js";import{c as re,i as v,n as ie,o as ae,r as oe,s as se,t as ce}from"./sampleDeckPlanXml-iRJNbK3Q.js";function le(e,t){let n=[],r=t.exec(e);for(;r;){let i=[];i.startIndex=t.lastIndex-r[0].length;let a=r.length;for(let e=0;e<a;e++)i.push(r[e]);n.push(i),r=t.exec(e)}return n}function ue(e){return e!==void 0}var de,y,b,fe,x=e((()=>{de=RegExp(`^[:A-Za-z_\\u00C0-\\u00D6\\u00D8-\\u00F6\\u00F8-\\u02FF\\u0370-\\u037D\\u037F-\\u1FFF\\u200C-\\u200D\\u2070-\\u218F\\u2C00-\\u2FEF\\u3001-\\uD7FF\\uF900-\\uFDCF\\uFDF0-\\uFFFD][:A-Za-z_\\u00C0-\\u00D6\\u00D8-\\u00F6\\u00F8-\\u02FF\\u0370-\\u037D\\u037F-\\u1FFF\\u200C-\\u200D\\u2070-\\u218F\\u2C00-\\u2FEF\\u3001-\\uD7FF\\uF900-\\uFDCF\\uFDF0-\\uFFFD\\-.\\d\\u00B7\\u0300-\\u036F\\u203F-\\u2040]*$`),y=function(e){return de.exec(e)!=null},b=[`hasOwnProperty`,`toString`,`valueOf`,`__defineGetter__`,`__defineSetter__`,`__lookupGetter__`,`__lookupSetter__`],fe=[`__proto__`,`constructor`,`prototype`]}));function pe(e,t){t=Object.assign({},Ce,t);let n=[],r=!1,i=!1;e[0]===`﻿`&&(e=e.substr(1));for(let a=0;a<e.length;a++)if(e[a]===`<`&&e[a+1]===`?`){if(a+=2,a=he(e,a),a.err)return a}else if(e[a]===`<`){let o=a;if(a++,e[a]===`!`){a=ge(e,a);continue}else{let s=!1;e[a]===`/`&&(s=!0,a++);let c=``;for(;a<e.length&&e[a]!==`>`&&e[a]!==` `&&e[a]!==`	`&&e[a]!==`
`&&e[a]!==`\r`;a++)c+=e[a];if(c=c.trim(),c[c.length-1]===`/`&&(c=c.substring(0,c.length-1),a--),!Se(c)){let t;return t=c.trim().length===0?`Invalid space after '<'.`:`Tag '`+c+`' is an invalid name.`,S(`InvalidTag`,t,C(e,a))}let l=_e(e,a);if(l===!1)return S(`InvalidAttr`,`Attributes for '`+c+`' have open quote.`,C(e,a));let u=l.value;if(a=l.index,u[u.length-1]===`/`){let n=a-u.length;u=u.substring(0,u.length-1);let i=ve(u,t);if(i===!0)r=!0;else return S(i.err.code,i.err.msg,C(e,n+i.err.line))}else if(s){if(!l.tagClosed)return S(`InvalidTag`,`Closing tag '`+c+`' doesn't have proper closing.`,C(e,a));if(u.trim().length>0)return S(`InvalidTag`,`Closing tag '`+c+`' can't have attributes or invalid starting.`,C(e,o));if(n.length===0)return S(`InvalidTag`,`Closing tag '`+c+`' has not been opened.`,C(e,o));{let t=n.pop();if(c!==t.tagName){let n=C(e,t.tagStartPos);return S(`InvalidTag`,`Expected closing tag '`+t.tagName+`' (opened in line `+n.line+`, col `+n.col+`) instead of closing tag '`+c+`'.`,C(e,o))}n.length==0&&(i=!0)}}else{let s=ve(u,t);if(s!==!0)return S(s.err.code,s.err.msg,C(e,a-u.length+s.err.line));if(i===!0)return S(`InvalidXml`,`Multiple possible root nodes found.`,C(e,a));t.unpairedTags.indexOf(c)!==-1||n.push({tagName:c,tagStartPos:o}),r=!0}for(a++;a<e.length;a++)if(e[a]===`<`)if(e[a+1]===`!`){a++,a=ge(e,a);continue}else if(e[a+1]===`?`){if(a=he(e,++a),a.err)return a}else break;else if(e[a]===`&`){let t=be(e,a);if(t==-1)return S(`InvalidChar`,`char '&' is not expected.`,C(e,a));a=t}else if(i===!0&&!me(e[a]))return S(`InvalidXml`,`Extra text at the end`,C(e,a));e[a]===`<`&&a--}}else{if(me(e[a]))continue;return S(`InvalidChar`,`char '`+e[a]+`' is not expected.`,C(e,a))}return r?n.length==1?S(`InvalidTag`,`Unclosed tag '`+n[0].tagName+`'.`,C(e,n[0].tagStartPos)):n.length>0?S(`InvalidXml`,`Invalid '`+JSON.stringify(n.map(e=>e.tagName),null,4).replace(/\r?\n/g,``)+`' found.`,{line:1,col:1}):!0:S(`InvalidXml`,`Start tag expected.`,1)}function me(e){return e===` `||e===`	`||e===`
`||e===`\r`}function he(e,t){let n=t;for(;t<e.length;t++)if(e[t]==`?`||e[t]==` `){let r=e.substr(n,t-n);if(t>5&&r===`xml`)return S(`InvalidXml`,`XML declaration allowed only at the start of the document.`,C(e,t));if(e[t]==`?`&&e[t+1]==`>`){t++;break}else continue}return t}function ge(e,t){if(e.length>t+5&&e[t+1]===`-`&&e[t+2]===`-`){for(t+=3;t<e.length;t++)if(e[t]===`-`&&e[t+1]===`-`&&e[t+2]===`>`){t+=2;break}}else if(e.length>t+8&&e[t+1]===`D`&&e[t+2]===`O`&&e[t+3]===`C`&&e[t+4]===`T`&&e[t+5]===`Y`&&e[t+6]===`P`&&e[t+7]===`E`){let n=1;for(t+=8;t<e.length;t++)if(e[t]===`<`)n++;else if(e[t]===`>`&&(n--,n===0))break}else if(e.length>t+9&&e[t+1]===`[`&&e[t+2]===`C`&&e[t+3]===`D`&&e[t+4]===`A`&&e[t+5]===`T`&&e[t+6]===`A`&&e[t+7]===`[`){for(t+=8;t<e.length;t++)if(e[t]===`]`&&e[t+1]===`]`&&e[t+2]===`>`){t+=2;break}}return t}function _e(e,t){let n=``,r=``,i=!1;for(;t<e.length;t++){if(e[t]===we||e[t]===Te)r===``?r=e[t]:r!==e[t]||(r=``);else if(e[t]===`>`&&r===``){i=!0;break}n+=e[t]}return r===``?{value:n,index:t,tagClosed:i}:!1}function ve(e,t){let n=le(e,Ee),r={};for(let e=0;e<n.length;e++){if(n[e][1].length===0)return S(`InvalidAttr`,`Attribute '`+n[e][2]+`' has no space in starting.`,w(n[e]));if(n[e][3]!==void 0&&n[e][4]===void 0)return S(`InvalidAttr`,`Attribute '`+n[e][2]+`' is without value.`,w(n[e]));if(n[e][3]===void 0&&!t.allowBooleanAttributes)return S(`InvalidAttr`,`boolean attribute '`+n[e][2]+`' is not allowed.`,w(n[e]));let i=n[e][2];if(!xe(i))return S(`InvalidAttr`,`Attribute '`+i+`' is an invalid name.`,w(n[e]));if(!Object.prototype.hasOwnProperty.call(r,i))r[i]=1;else return S(`InvalidAttr`,`Attribute '`+i+`' is repeated.`,w(n[e]))}return!0}function ye(e,t){let n=/\d/;for(e[t]===`x`&&(t++,n=/[\da-fA-F]/);t<e.length;t++){if(e[t]===`;`)return t;if(!e[t].match(n))break}return-1}function be(e,t){if(t++,e[t]===`;`)return-1;if(e[t]===`#`)return t++,ye(e,t);let n=0;for(;t<e.length;t++,n++)if(!(e[t].match(/\w/)&&n<20)){if(e[t]===`;`)break;return-1}return t}function S(e,t,n){return{err:{code:e,msg:t,line:n.line||n,col:n.col}}}function xe(e){return y(e)}function Se(e){return y(e)}function C(e,t){let n=e.substring(0,t).split(/\r?\n/);return{line:n.length,col:n[n.length-1].length+1}}function w(e){return e.startIndex+e[1].length}var Ce,we,Te,Ee,De=e((()=>{x(),Ce={allowBooleanAttributes:!1,unpairedTags:[]},we=`"`,Te=`'`,Ee=RegExp(`(\\s*)([^\\s=]+)(\\s*=)?(\\s*(['"])(([\\s\\S])*?)\\5)?`,`g`)})),Oe,ke,Ae,je,Me,Ne,Pe,Fe,Ie,Le,T,Re,ze,Be,Ve,He=e((()=>{Oe={amp:`&`,AMP:`&`,lt:`<`,LT:`<`,gt:`>`,GT:`>`,quot:`"`,QUOT:`"`,apos:`'`,lsquo:`‘`,rsquo:`’`,ldquo:`“`,rdquo:`”`,lsquor:`‚`,rsquor:`’`,ldquor:`„`,bdquo:`„`,comma:`,`,period:`.`,colon:`:`,semi:`;`,excl:`!`,quest:`?`,num:`#`,dollar:`$`,percent:`%`,amp:`&`,ast:`*`,commat:`@`,lowbar:`_`,verbar:`|`,vert:`|`,sol:`/`,bsol:`\\`,lbrace:`{`,rbrace:`}`,lbrack:`[`,rbrack:`]`,lpar:`(`,rpar:`)`,nbsp:`\xA0`,iexcl:`¡`,cent:`¢`,pound:`£`,curren:`¤`,yen:`¥`,brvbar:`¦`,sect:`§`,uml:`¨`,copy:`©`,COPY:`©`,ordf:`ª`,laquo:`«`,not:`¬`,shy:`­`,reg:`®`,REG:`®`,macr:`¯`,deg:`°`,plusmn:`±`,sup2:`²`,sup3:`³`,acute:`´`,micro:`µ`,para:`¶`,middot:`·`,cedil:`¸`,sup1:`¹`,ordm:`º`,raquo:`»`,frac14:`¼`,frac12:`½`,half:`½`,frac34:`¾`,iquest:`¿`,times:`×`,div:`÷`,divide:`÷`},ke={Agrave:`À`,agrave:`à`,Aacute:`Á`,aacute:`á`,Acirc:`Â`,acirc:`â`,Atilde:`Ã`,atilde:`ã`,Auml:`Ä`,auml:`ä`,Aring:`Å`,aring:`å`,AElig:`Æ`,aelig:`æ`,Ccedil:`Ç`,ccedil:`ç`,Egrave:`È`,egrave:`è`,Eacute:`É`,eacute:`é`,Ecirc:`Ê`,ecirc:`ê`,Euml:`Ë`,euml:`ë`,Igrave:`Ì`,igrave:`ì`,Iacute:`Í`,iacute:`í`,Icirc:`Î`,icirc:`î`,Iuml:`Ï`,iuml:`ï`,ETH:`Ð`,eth:`ð`,Ntilde:`Ñ`,ntilde:`ñ`,Ograve:`Ò`,ograve:`ò`,Oacute:`Ó`,oacute:`ó`,Ocirc:`Ô`,ocirc:`ô`,Otilde:`Õ`,otilde:`õ`,Ouml:`Ö`,ouml:`ö`,Oslash:`Ø`,oslash:`ø`,Ugrave:`Ù`,ugrave:`ù`,Uacute:`Ú`,uacute:`ú`,Ucirc:`Û`,ucirc:`û`,Uuml:`Ü`,uuml:`ü`,Yacute:`Ý`,yacute:`ý`,THORN:`Þ`,thorn:`þ`,szlig:`ß`,yuml:`ÿ`,Yuml:`Ÿ`},Ae={Amacr:`Ā`,amacr:`ā`,Abreve:`Ă`,abreve:`ă`,Aogon:`Ą`,aogon:`ą`,Cacute:`Ć`,cacute:`ć`,Ccirc:`Ĉ`,ccirc:`ĉ`,Cdot:`Ċ`,cdot:`ċ`,Ccaron:`Č`,ccaron:`č`,Dcaron:`Ď`,dcaron:`ď`,Dstrok:`Đ`,dstrok:`đ`,Emacr:`Ē`,emacr:`ē`,Ecaron:`Ě`,ecaron:`ě`,Edot:`Ė`,edot:`ė`,Eogon:`Ę`,eogon:`ę`,Gcirc:`Ĝ`,gcirc:`ĝ`,Gbreve:`Ğ`,gbreve:`ğ`,Gdot:`Ġ`,gdot:`ġ`,Gcedil:`Ģ`,Hcirc:`Ĥ`,hcirc:`ĥ`,Hstrok:`Ħ`,hstrok:`ħ`,Itilde:`Ĩ`,itilde:`ĩ`,Imacr:`Ī`,imacr:`ī`,Iogon:`Į`,iogon:`į`,Idot:`İ`,IJlig:`Ĳ`,ijlig:`ĳ`,Jcirc:`Ĵ`,jcirc:`ĵ`,Kcedil:`Ķ`,kcedil:`ķ`,kgreen:`ĸ`,Lacute:`Ĺ`,lacute:`ĺ`,Lcedil:`Ļ`,lcedil:`ļ`,Lcaron:`Ľ`,lcaron:`ľ`,Lmidot:`Ŀ`,lmidot:`ŀ`,Lstrok:`Ł`,lstrok:`ł`,Nacute:`Ń`,nacute:`ń`,Ncaron:`Ň`,ncaron:`ň`,Ncedil:`Ņ`,ncedil:`ņ`,ENG:`Ŋ`,eng:`ŋ`,Omacr:`Ō`,omacr:`ō`,Odblac:`Ő`,odblac:`ő`,OElig:`Œ`,oelig:`œ`,Racute:`Ŕ`,racute:`ŕ`,Rcaron:`Ř`,rcaron:`ř`,Rcedil:`Ŗ`,rcedil:`ŗ`,Sacute:`Ś`,sacute:`ś`,Scirc:`Ŝ`,scirc:`ŝ`,Scedil:`Ş`,scedil:`ş`,Scaron:`Š`,scaron:`š`,Tcedil:`Ţ`,tcedil:`ţ`,Tcaron:`Ť`,tcaron:`ť`,Tstrok:`Ŧ`,tstrok:`ŧ`,Utilde:`Ũ`,utilde:`ũ`,Umacr:`Ū`,umacr:`ū`,Ubreve:`Ŭ`,ubreve:`ŭ`,Uring:`Ů`,uring:`ů`,Udblac:`Ű`,udblac:`ű`,Uogon:`Ų`,uogon:`ų`,Wcirc:`Ŵ`,wcirc:`ŵ`,Ycirc:`Ŷ`,ycirc:`ŷ`,Zacute:`Ź`,zacute:`ź`,Zdot:`Ż`,zdot:`ż`,Zcaron:`Ž`,zcaron:`ž`},je={Alpha:`Α`,alpha:`α`,Beta:`Β`,beta:`β`,Gamma:`Γ`,gamma:`γ`,Delta:`Δ`,delta:`δ`,Epsilon:`Ε`,epsilon:`ε`,epsiv:`ϵ`,varepsilon:`ϵ`,Zeta:`Ζ`,zeta:`ζ`,Eta:`Η`,eta:`η`,Theta:`Θ`,theta:`θ`,thetasym:`ϑ`,vartheta:`ϑ`,Iota:`Ι`,iota:`ι`,Kappa:`Κ`,kappa:`κ`,kappav:`ϰ`,varkappa:`ϰ`,Lambda:`Λ`,lambda:`λ`,Mu:`Μ`,mu:`μ`,Nu:`Ν`,nu:`ν`,Xi:`Ξ`,xi:`ξ`,Omicron:`Ο`,omicron:`ο`,Pi:`Π`,pi:`π`,piv:`ϖ`,varpi:`ϖ`,Rho:`Ρ`,rho:`ρ`,rhov:`ϱ`,varrho:`ϱ`,Sigma:`Σ`,sigma:`σ`,sigmaf:`ς`,sigmav:`ς`,varsigma:`ς`,Tau:`Τ`,tau:`τ`,Upsilon:`Υ`,upsilon:`υ`,upsi:`υ`,Upsi:`ϒ`,upsih:`ϒ`,Phi:`Φ`,phi:`φ`,phiv:`ϕ`,varphi:`ϕ`,Chi:`Χ`,chi:`χ`,Psi:`Ψ`,psi:`ψ`,Omega:`Ω`,omega:`ω`,ohm:`Ω`,Gammad:`Ϝ`,gammad:`ϝ`,digamma:`ϝ`},Me={Afr:`𝔄`,afr:`𝔞`,Acy:`А`,acy:`а`,Bcy:`Б`,bcy:`б`,Vcy:`В`,vcy:`в`,Gcy:`Г`,gcy:`г`,Dcy:`Д`,dcy:`д`,IEcy:`Е`,iecy:`е`,IOcy:`Ё`,iocy:`ё`,ZHcy:`Ж`,zhcy:`ж`,Zcy:`З`,zcy:`з`,Icy:`И`,icy:`и`,Jcy:`Й`,jcy:`й`,Kcy:`К`,kcy:`к`,Lcy:`Л`,lcy:`л`,Mcy:`М`,mcy:`м`,Ncy:`Н`,ncy:`н`,Ocy:`О`,ocy:`о`,Pcy:`П`,pcy:`п`,Rcy:`Р`,rcy:`р`,Scy:`С`,scy:`с`,Tcy:`Т`,tcy:`т`,Ucy:`У`,ucy:`у`,Fcy:`Ф`,fcy:`ф`,KHcy:`Х`,khcy:`х`,TScy:`Ц`,tscy:`ц`,CHcy:`Ч`,chcy:`ч`,SHcy:`Ш`,shcy:`ш`,SHCHcy:`Щ`,shchcy:`щ`,HARDcy:`Ъ`,hardcy:`ъ`,Ycy:`Ы`,ycy:`ы`,SOFTcy:`Ь`,softcy:`ь`,Ecy:`Э`,ecy:`э`,YUcy:`Ю`,yucy:`ю`,YAcy:`Я`,yacy:`я`,DJcy:`Ђ`,djcy:`ђ`,GJcy:`Ѓ`,gjcy:`ѓ`,Jukcy:`Є`,jukcy:`є`,DScy:`Ѕ`,dscy:`ѕ`,Iukcy:`І`,iukcy:`і`,YIcy:`Ї`,yicy:`ї`,Jsercy:`Ј`,jsercy:`ј`,LJcy:`Љ`,ljcy:`љ`,NJcy:`Њ`,njcy:`њ`,TSHcy:`Ћ`,tshcy:`ћ`,KJcy:`Ќ`,kjcy:`ќ`,Ubrcy:`Ў`,ubrcy:`ў`,DZcy:`Џ`,dzcy:`џ`},Ne={plus:`+`,minus:`−`,mnplus:`∓`,mp:`∓`,pm:`±`,times:`×`,div:`÷`,divide:`÷`,sdot:`⋅`,star:`☆`,starf:`★`,bigstar:`★`,lowast:`∗`,ast:`*`,midast:`*`,compfn:`∘`,smallcircle:`∘`,bullet:`•`,bull:`•`,nbsp:`\xA0`,hellip:`…`,mldr:`…`,prime:`′`,Prime:`″`,tprime:`‴`,bprime:`‵`,backprime:`‵`,minus:`−`,minusd:`∸`,dotminus:`∸`,plusdo:`∔`,dotplus:`∔`,plusmn:`±`,minusplus:`∓`,mnplus:`∓`,mp:`∓`,setminus:`∖`,smallsetminus:`∖`,Backslash:`∖`,setmn:`∖`,ssetmn:`∖`,lowbar:`_`,verbar:`|`,vert:`|`,VerticalLine:`|`,colon:`:`,Colon:`∷`,Proportion:`∷`,ratio:`∶`,equals:`=`,ne:`≠`,nequiv:`≢`,equiv:`≡`,Congruent:`≡`,sim:`∼`,thicksim:`∼`,thksim:`∼`,sime:`≃`,simeq:`≃`,TildeEqual:`≃`,asymp:`≈`,approx:`≈`,thickapprox:`≈`,thkap:`≈`,TildeTilde:`≈`,ncong:`≇`,cong:`≅`,TildeFullEqual:`≅`,asympeq:`≍`,CupCap:`≍`,bump:`≎`,Bumpeq:`≎`,HumpDownHump:`≎`,bumpe:`≏`,bumpeq:`≏`,HumpEqual:`≏`,dotminus:`∸`,minusd:`∸`,plusdo:`∔`,dotplus:`∔`,le:`≤`,LessEqual:`≤`,ge:`≥`,GreaterEqual:`≥`,lesseqgtr:`⋚`,lesseqqgtr:`⪋`,greater:`>`,less:`<`},Pe={alefsym:`ℵ`,aleph:`ℵ`,beth:`ℶ`,gimel:`ℷ`,daleth:`ℸ`,forall:`∀`,ForAll:`∀`,part:`∂`,PartialD:`∂`,exist:`∃`,Exists:`∃`,nexist:`∄`,nexists:`∄`,empty:`∅`,emptyset:`∅`,emptyv:`∅`,varnothing:`∅`,nabla:`∇`,Del:`∇`,isin:`∈`,isinv:`∈`,in:`∈`,Element:`∈`,notin:`∉`,notinva:`∉`,ni:`∋`,niv:`∋`,SuchThat:`∋`,ReverseElement:`∋`,notni:`∌`,notniva:`∌`,prod:`∏`,Product:`∏`,coprod:`∐`,Coproduct:`∐`,sum:`∑`,Sum:`∑`,minus:`−`,mp:`∓`,plusdo:`∔`,dotplus:`∔`,setminus:`∖`,lowast:`∗`,radic:`√`,Sqrt:`√`,prop:`∝`,propto:`∝`,Proportional:`∝`,varpropto:`∝`,infin:`∞`,infintie:`⧝`,ang:`∠`,angle:`∠`,angmsd:`∡`,measuredangle:`∡`,angsph:`∢`,mid:`∣`,VerticalBar:`∣`,nmid:`∤`,nsmid:`∤`,npar:`∦`,parallel:`∥`,spar:`∥`,nparallel:`∦`,nspar:`∦`,and:`∧`,wedge:`∧`,or:`∨`,vee:`∨`,cap:`∩`,cup:`∪`,int:`∫`,Integral:`∫`,conint:`∮`,ContourIntegral:`∮`,Conint:`∯`,DoubleContourIntegral:`∯`,Cconint:`∰`,there4:`∴`,therefore:`∴`,Therefore:`∴`,becaus:`∵`,because:`∵`,Because:`∵`,ratio:`∶`,Proportion:`∷`,minusd:`∸`,dotminus:`∸`,mDDot:`∺`,homtht:`∻`,sim:`∼`,bsimg:`∽`,backsim:`∽`,ac:`∾`,mstpos:`∾`,acd:`∿`,VerticalTilde:`≀`,wr:`≀`,wreath:`≀`,nsime:`≄`,nsimeq:`≄`,nsimeq:`≄`,ncong:`≇`,simne:`≆`,ncongdot:`⩭̸`,ngsim:`≵`,nsim:`≁`,napprox:`≉`,nap:`≉`,ngeq:`≱`,nge:`≱`,nleq:`≰`,nle:`≰`,ngtr:`≯`,ngt:`≯`,nless:`≮`,nlt:`≮`,nprec:`⊀`,npr:`⊀`,nsucc:`⊁`,nsc:`⊁`},Fe={larr:`←`,leftarrow:`←`,LeftArrow:`←`,uarr:`↑`,uparrow:`↑`,UpArrow:`↑`,rarr:`→`,rightarrow:`→`,RightArrow:`→`,darr:`↓`,downarrow:`↓`,DownArrow:`↓`,harr:`↔`,leftrightarrow:`↔`,LeftRightArrow:`↔`,varr:`↕`,updownarrow:`↕`,UpDownArrow:`↕`,nwarr:`↖`,nwarrow:`↖`,UpperLeftArrow:`↖`,nearr:`↗`,nearrow:`↗`,UpperRightArrow:`↗`,searr:`↘`,searrow:`↘`,LowerRightArrow:`↘`,swarr:`↙`,swarrow:`↙`,LowerLeftArrow:`↙`,lArr:`⇐`,Leftarrow:`⇐`,uArr:`⇑`,Uparrow:`⇑`,rArr:`⇒`,Rightarrow:`⇒`,dArr:`⇓`,Downarrow:`⇓`,hArr:`⇔`,Leftrightarrow:`⇔`,iff:`⇔`,vArr:`⇕`,Updownarrow:`⇕`,lAarr:`⇚`,Lleftarrow:`⇚`,rAarr:`⇛`,Rrightarrow:`⇛`,lrarr:`⇆`,leftrightarrows:`⇆`,rlarr:`⇄`,rightleftarrows:`⇄`,lrhar:`⇋`,leftrightharpoons:`⇋`,ReverseEquilibrium:`⇋`,rlhar:`⇌`,rightleftharpoons:`⇌`,Equilibrium:`⇌`,udarr:`⇅`,UpArrowDownArrow:`⇅`,duarr:`⇵`,DownArrowUpArrow:`⇵`,llarr:`⇇`,leftleftarrows:`⇇`,rrarr:`⇉`,rightrightarrows:`⇉`,ddarr:`⇊`,downdownarrows:`⇊`,har:`↽`,lhard:`↽`,leftharpoondown:`↽`,lharu:`↼`,leftharpoonup:`↼`,rhard:`⇁`,rightharpoondown:`⇁`,rharu:`⇀`,rightharpoonup:`⇀`,lsh:`↰`,Lsh:`↰`,rsh:`↱`,Rsh:`↱`,ldsh:`↲`,rdsh:`↳`,hookleftarrow:`↩`,hookrightarrow:`↪`,mapstoleft:`↤`,mapstoup:`↥`,map:`↦`,mapsto:`↦`,mapstodown:`↧`,crarr:`↵`,nwarrow:`↖`,nearrow:`↗`,searrow:`↘`,swarrow:`↙`,nleftarrow:`↚`,nleftrightarrow:`↮`,nrightarrow:`↛`,nrarr:`↛`,larrtl:`↢`,rarrtl:`↣`,leftarrowtail:`↢`,rightarrowtail:`↣`,twoheadleftarrow:`↞`,twoheadrightarrow:`↠`,Larr:`↞`,Rarr:`↠`,larrhk:`↩`,rarrhk:`↪`,larrlp:`↫`,looparrowleft:`↫`,rarrlp:`↬`,looparrowright:`↬`,harrw:`↭`,leftrightsquigarrow:`↭`,nrarrw:`↝̸`,rarrw:`↝`,rightsquigarrow:`↝`,larrbfs:`⤟`,rarrbfs:`⤠`,nvHarr:`⤄`,nvlArr:`⤂`,nvrArr:`⤃`,larrfs:`⤝`,rarrfs:`⤞`,Map:`⤅`,larrsim:`⥳`,rarrsim:`⥴`,harrcir:`⥈`,Uarrocir:`⥉`,lurdshar:`⥊`,ldrdhar:`⥧`,ldrushar:`⥋`,rdldhar:`⥩`,lrhard:`⥭`,rlhar:`⇌`,uharr:`↾`,uharl:`↿`,dharr:`⇂`,dharl:`⇃`,Uarr:`↟`,Darr:`↡`,zigrarr:`⇝`,nwArr:`⇖`,neArr:`⇗`,seArr:`⇘`,swArr:`⇙`,nharr:`↮`,nhArr:`⇎`,nlarr:`↚`,nlArr:`⇍`,nrarr:`↛`,nrArr:`⇏`,larrb:`⇤`,LeftArrowBar:`⇤`,rarrb:`⇥`,RightArrowBar:`⇥`},Ie={square:`□`,Square:`□`,squ:`□`,squf:`▪`,squarf:`▪`,blacksquar:`▪`,blacksquare:`▪`,FilledVerySmallSquare:`▪`,blk34:`▓`,blk12:`▒`,blk14:`░`,block:`█`,srect:`▭`,rect:`▭`,sdot:`⋅`,sdotb:`⊡`,dotsquare:`⊡`,triangle:`▵`,tri:`▵`,trine:`▵`,utri:`▵`,triangledown:`▿`,dtri:`▿`,tridown:`▿`,triangleleft:`◃`,ltri:`◃`,triangleright:`▹`,rtri:`▹`,blacktriangle:`▴`,utrif:`▴`,blacktriangledown:`▾`,dtrif:`▾`,blacktriangleleft:`◂`,ltrif:`◂`,blacktriangleright:`▸`,rtrif:`▸`,loz:`◊`,lozenge:`◊`,blacklozenge:`⧫`,lozf:`⧫`,bigcirc:`◯`,xcirc:`◯`,circ:`ˆ`,Circle:`○`,cir:`○`,o:`○`,bullet:`•`,bull:`•`,hellip:`…`,mldr:`…`,nldr:`‥`,boxh:`─`,HorizontalLine:`─`,boxv:`│`,boxdr:`┌`,boxdl:`┐`,boxur:`└`,boxul:`┘`,boxvr:`├`,boxvl:`┤`,boxhd:`┬`,boxhu:`┴`,boxvh:`┼`,boxH:`═`,boxV:`║`,boxdR:`╒`,boxDr:`╓`,boxDR:`╔`,boxDl:`╕`,boxdL:`╖`,boxDL:`╗`,boxuR:`╘`,boxUr:`╙`,boxUR:`╚`,boxUl:`╜`,boxuL:`╛`,boxUL:`╝`,boxvR:`╞`,boxVr:`╟`,boxVR:`╠`,boxVl:`╢`,boxvL:`╡`,boxVL:`╣`,boxHd:`╤`,boxhD:`╥`,boxHD:`╦`,boxHu:`╧`,boxhU:`╨`,boxHU:`╩`,boxvH:`╪`,boxVh:`╫`,boxVH:`╬`},Le={excl:`!`,iexcl:`¡`,brvbar:`¦`,sect:`§`,uml:`¨`,copy:`©`,ordf:`ª`,laquo:`«`,not:`¬`,shy:`­`,reg:`®`,macr:`¯`,deg:`°`,plusmn:`±`,sup2:`²`,sup3:`³`,acute:`´`,micro:`µ`,para:`¶`,middot:`·`,cedil:`¸`,sup1:`¹`,ordm:`º`,raquo:`»`,frac14:`¼`,frac12:`½`,frac34:`¾`,iquest:`¿`,nbsp:`\xA0`,comma:`,`,period:`.`,colon:`:`,semi:`;`,vert:`|`,Verbar:`‖`,verbar:`|`,dblac:`˝`,circ:`ˆ`,caron:`ˇ`,breve:`˘`,dot:`˙`,ring:`˚`,ogon:`˛`,tilde:`˜`,DiacriticalGrave:"`",DiacriticalAcute:`´`,DiacriticalTilde:`˜`,DiacriticalDot:`˙`,DiacriticalDoubleAcute:`˝`,grave:"`",acute:`´`},T={cent:`¢`,pound:`£`,curren:`¤`,yen:`¥`,euro:`€`,dollar:`$`,euro:`€`,fnof:`ƒ`,inr:`₹`,af:`؋`,birr:`ብር`,peso:`₱`,rub:`₽`,won:`₩`,yuan:`¥`,cedil:`¸`},Re={frac12:`½`,half:`½`,frac13:`⅓`,frac14:`¼`,frac15:`⅕`,frac16:`⅙`,frac18:`⅛`,frac23:`⅔`,frac25:`⅖`,frac34:`¾`,frac35:`⅗`,frac38:`⅜`,frac45:`⅘`,frac56:`⅚`,frac58:`⅝`,frac78:`⅞`,frasl:`⁄`},ze={trade:`™`,TRADE:`™`,telrec:`⌕`,target:`⌖`,ulcorn:`⌜`,ulcorner:`⌜`,urcorn:`⌝`,urcorner:`⌝`,dlcorn:`⌞`,llcorner:`⌞`,drcorn:`⌟`,lrcorner:`⌟`,intercal:`⊺`,intcal:`⊺`,oplus:`⊕`,CirclePlus:`⊕`,ominus:`⊖`,CircleMinus:`⊖`,otimes:`⊗`,CircleTimes:`⊗`,osol:`⊘`,odot:`⊙`,CircleDot:`⊙`,oast:`⊛`,circledast:`⊛`,odash:`⊝`,circleddash:`⊝`,ocirc:`⊚`,circledcirc:`⊚`,boxplus:`⊞`,plusb:`⊞`,boxminus:`⊟`,minusb:`⊟`,boxtimes:`⊠`,timesb:`⊠`,boxdot:`⊡`,sdotb:`⊡`,veebar:`⊻`,vee:`∨`,barvee:`⊽`,and:`∧`,wedge:`∧`,Cap:`⋒`,Cup:`⋓`,Fork:`⋔`,pitchfork:`⋔`,epar:`⋕`,ltlarr:`⥶`,nvap:`≍⃒`,nvsim:`∼⃒`,nvge:`≥⃒`,nvle:`≤⃒`,nvlt:`<⃒`,nvgt:`>⃒`,nvltrie:`⊴⃒`,nvrtrie:`⊵⃒`,Vdash:`⊩`,dashv:`⊣`,vDash:`⊨`,Vdash:`⊩`,Vvdash:`⊪`,nvdash:`⊬`,nvDash:`⊭`,nVdash:`⊮`,nVDash:`⊯`},{...Oe,...ke,...Ae,...je,...Me,...Ne,...Pe,...Fe,...Ie,...Le,...T,...Re,...ze},Be={amp:`&`,apos:`'`,gt:`>`,lt:`<`,quot:`"`},Ve={nbsp:`\xA0`,copy:`©`,reg:`®`,trade:`™`,mdash:`—`,ndash:`–`,hellip:`…`,laquo:`«`,raquo:`»`,lsquo:`‘`,rsquo:`’`,ldquo:`“`,rdquo:`”`,bull:`•`,para:`¶`,sect:`§`,deg:`°`,frac12:`½`,frac14:`¼`,frac34:`¾`}}));function Ue(e){if(e[0]===`#`)throw Error(`[EntityReplacer] Invalid character '#' in entity name: "${e}"`);for(let t of e)if(qe.has(t))throw Error(`[EntityReplacer] Invalid character '${t}' in entity name: "${e}"`);return e}function We(...e){let t=Object.create(null);for(let n of e)if(n)for(let e of Object.keys(n)){let r=n[e];if(typeof r==`string`)t[e]=r;else if(r&&typeof r==`object`&&r.val!==void 0){let n=r.val;typeof n==`string`&&(t[e]=n)}}return t}function Ge(e){return!e||e===E?new Set([E]):e===O?new Set([O]):e===D?new Set([D]):Array.isArray(e)?new Set(e):new Set([E])}function Ke(e){if(!e)return{xmlVersion:1,onLevel:k.allow,nullLevel:k.remove};let t=e.xmlVersion===1.1?1.1:1,n=k[e.onNCR]??k.allow,r=k[e.nullNCR]??k.remove;return{xmlVersion:t,onLevel:n,nullLevel:Math.max(r,k.remove)}}var qe,E,D,O,k,Je,Ye,Xe=e((()=>{He(),qe=new Set(`!?\\\\/[]$%{}^&*()<>|+`),E=`external`,D=`base`,O=`all`,k=Object.freeze({allow:0,leave:1,remove:2,throw:3}),Je=new Set([9,10,13]),Ye=class{constructor(e={}){this._limit=e.limit||{},this._maxTotalExpansions=this._limit.maxTotalExpansions||0,this._maxExpandedLength=this._limit.maxExpandedLength||0,this._postCheck=typeof e.postCheck==`function`?e.postCheck:e=>e,this._limitTiers=Ge(this._limit.applyLimitsTo??E),this._numericAllowed=e.numericAllowed??!0,this._baseMap=We(Be,e.namedEntities||null),this._externalMap=Object.create(null),this._inputMap=Object.create(null),this._totalExpansions=0,this._expandedLength=0,this._removeSet=new Set(e.remove&&Array.isArray(e.remove)?e.remove:[]),this._leaveSet=new Set(e.leave&&Array.isArray(e.leave)?e.leave:[]);let t=Ke(e.ncr);this._ncrXmlVersion=t.xmlVersion,this._ncrOnLevel=t.onLevel,this._ncrNullLevel=t.nullLevel}setExternalEntities(e){if(e)for(let t of Object.keys(e))Ue(t);this._externalMap=We(e)}addExternalEntity(e,t){Ue(e),typeof t==`string`&&t.indexOf(`&`)===-1&&(this._externalMap[e]=t)}addInputEntities(e){this._totalExpansions=0,this._expandedLength=0,this._inputMap=We(e)}reset(){return this._inputMap=Object.create(null),this._totalExpansions=0,this._expandedLength=0,this}setXmlVersion(e){this._ncrXmlVersion=e===1.1?1.1:1}decode(e){if(typeof e!=`string`||e.length===0)return e;let t=e,n=[],r=e.length,i=0,a=0,o=this._maxTotalExpansions>0,s=this._maxExpandedLength>0,c=o||s;for(;a<r;){if(e.charCodeAt(a)!==38){a++;continue}let t=a+1;for(;t<r&&e.charCodeAt(t)!==59&&t-a<=32;)t++;if(t>=r||e.charCodeAt(t)!==59){a++;continue}let l=e.slice(a+1,t);if(l.length===0){a++;continue}let u,d;if(this._removeSet.has(l))u=``,d===void 0&&(d=E);else if(this._leaveSet.has(l)){a++;continue}else if(l.charCodeAt(0)===35){let e=this._resolveNCR(l);if(e===void 0){a++;continue}u=e,d=D}else{let e=this._resolveName(l);u=e?.value,d=e?.tier}if(u===void 0){a++;continue}if(a>i&&n.push(e.slice(i,a)),n.push(u),i=t+1,a=i,c&&this._tierCounts(d)){if(o&&(this._totalExpansions++,this._totalExpansions>this._maxTotalExpansions))throw Error(`[EntityReplacer] Entity expansion count limit exceeded: ${this._totalExpansions} > ${this._maxTotalExpansions}`);if(s){let e=u.length-(l.length+2);if(e>0&&(this._expandedLength+=e,this._expandedLength>this._maxExpandedLength))throw Error(`[EntityReplacer] Expanded content length limit exceeded: ${this._expandedLength} > ${this._maxExpandedLength}`)}}}i<r&&n.push(e.slice(i));let l=n.length===0?e:n.join(``);return this._postCheck(l,t)}_tierCounts(e){return this._limitTiers.has(O)?!0:this._limitTiers.has(e)}_resolveName(e){if(e in this._inputMap)return{value:this._inputMap[e],tier:E};if(e in this._externalMap)return{value:this._externalMap[e],tier:E};if(e in this._baseMap)return{value:this._baseMap[e],tier:D}}_classifyNCR(e){return e===0?this._ncrNullLevel:e>=55296&&e<=57343||this._ncrXmlVersion===1&&e>=1&&e<=31&&!Je.has(e)?k.remove:-1}_applyNCRAction(e,t,n){switch(e){case k.allow:return String.fromCodePoint(n);case k.remove:return``;case k.leave:return;case k.throw:throw Error(`[EntityDecoder] Prohibited numeric character reference &${t}; (U+${n.toString(16).toUpperCase().padStart(4,`0`)})`);default:return String.fromCodePoint(n)}}_resolveNCR(e){let t=e.charCodeAt(1),n;if(n=t===120||t===88?parseInt(e.slice(2),16):parseInt(e.slice(1),10),Number.isNaN(n)||n<0||n>1114111)return;let r=this._classifyNCR(n);if(!this._numericAllowed&&r<k.remove)return;let i=r===-1?this._ncrOnLevel:Math.max(this._ncrOnLevel,r);return this._applyNCRAction(i,e,n)}}})),Ze=e((()=>{Xe(),He()}));function Qe(e,t){if(typeof e!=`string`)return;let n=e.toLowerCase();if(b.some(e=>n===e.toLowerCase())||fe.some(e=>n===e.toLowerCase()))throw Error(`[SECURITY] Invalid ${t}: "${e}" is a reserved JavaScript keyword that could cause prototype pollution`)}function $e(e,t){return typeof e==`boolean`?{enabled:e,maxEntitySize:1e4,maxExpansionDepth:1e4,maxTotalExpansions:1/0,maxExpandedLength:1e5,maxEntityCount:1e3,allowedTags:null,tagFilter:null,appliesTo:`all`}:typeof e==`object`&&e?{enabled:e.enabled!==!1,maxEntitySize:Math.max(1,e.maxEntitySize??1e4),maxExpansionDepth:Math.max(1,e.maxExpansionDepth??1e4),maxTotalExpansions:Math.max(1,e.maxTotalExpansions??1/0),maxExpandedLength:Math.max(1,e.maxExpandedLength??1e5),maxEntityCount:Math.max(1,e.maxEntityCount??1e3),allowedTags:e.allowedTags??null,tagFilter:e.tagFilter??null,appliesTo:e.appliesTo??`all`}:$e(!0)}var et,tt,nt,rt=e((()=>{x(),et=e=>b.includes(e)?`__`+e:e,tt={preserveOrder:!1,attributeNamePrefix:`@_`,attributesGroupName:!1,textNodeName:`#text`,ignoreAttributes:!0,removeNSPrefix:!1,allowBooleanAttributes:!1,parseTagValue:!0,parseAttributeValue:!1,trimValues:!0,cdataPropName:!1,numberParseOptions:{hex:!0,leadingZeros:!0,eNotation:!0},tagValueProcessor:function(e,t){return t},attributeValueProcessor:function(e,t){return t},stopNodes:[],alwaysCreateTextNode:!1,isArray:()=>!1,commentPropName:!1,unpairedTags:[],processEntities:!0,htmlEntities:!1,entityDecoder:null,ignoreDeclaration:!1,ignorePiTags:!1,transformTagName:!1,transformAttributeName:!1,updateTag:function(e,t,n){return e},captureMetaData:!1,maxNestedTags:100,strictReservedNames:!0,jPath:!0,onDangerousProperty:et},nt=function(e){let t=Object.assign({},tt,e),n=[{value:t.attributeNamePrefix,name:`attributeNamePrefix`},{value:t.attributesGroupName,name:`attributesGroupName`},{value:t.textNodeName,name:`textNodeName`},{value:t.cdataPropName,name:`cdataPropName`},{value:t.commentPropName,name:`commentPropName`}];for(let{value:e,name:t}of n)e&&Qe(e,t);return t.onDangerousProperty===null&&(t.onDangerousProperty=et),t.processEntities=$e(t.processEntities,t.htmlEntities),t.unpairedTagsSet=new Set(t.unpairedTags),t.stopNodes&&Array.isArray(t.stopNodes)&&(t.stopNodes=t.stopNodes.map(e=>typeof e==`string`&&e.startsWith(`*.`)?`..`+e.substring(2):e)),t}})),it,A,at=e((()=>{it=typeof Symbol==`function`?Symbol(`XML Node Metadata`):`@@xmlMetadata`,A=class{constructor(e){this.tagname=e,this.child=[],this[`:@`]=Object.create(null)}add(e,t){e===`__proto__`&&(e=`#__proto__`),this.child.push({[e]:t})}addChild(e,t){e.tagname===`__proto__`&&(e.tagname=`#__proto__`),e[`:@`]&&Object.keys(e[`:@`]).length>0?this.child.push({[e.tagname]:e.child,":@":e[`:@`]}):this.child.push({[e.tagname]:e.child}),t!==void 0&&(this.child[this.child.length-1][it]={startIndex:t})}static getMetaDataSymbol(){return it}}}));function j(e,t,n){for(let r=0;r<t.length;r++)if(t[r]!==e[n+r+1])return!1;return!0}function M(e){if(y(e))return e;throw Error(`Invalid entity name ${e}`)}var ot,N,st=e((()=>{x(),ot=class{constructor(e){this.suppressValidationErr=!e,this.options=e}readDocType(e,t){let n=Object.create(null),r=0;if(e[t+3]===`O`&&e[t+4]===`C`&&e[t+5]===`T`&&e[t+6]===`Y`&&e[t+7]===`P`&&e[t+8]===`E`){t+=9;let i=1,a=!1,o=!1,s=``;for(;t<e.length;t++)if(e[t]===`<`&&!o){if(a&&j(e,`!ENTITY`,t)){t+=7;let i,a;if([i,a,t]=this.readEntityExp(e,t+1,this.suppressValidationErr),a.indexOf(`&`)===-1){if(this.options.enabled!==!1&&this.options.maxEntityCount!=null&&r>=this.options.maxEntityCount)throw Error(`Entity count (${r+1}) exceeds maximum allowed (${this.options.maxEntityCount})`);n[i]=a,r++}}else if(a&&j(e,`!ELEMENT`,t)){t+=8;let{index:n}=this.readElementExp(e,t+1);t=n}else if(a&&j(e,`!ATTLIST`,t))t+=8;else if(a&&j(e,`!NOTATION`,t)){t+=9;let{index:n}=this.readNotationExp(e,t+1,this.suppressValidationErr);t=n}else if(j(e,`!--`,t))o=!0;else throw Error(`Invalid DOCTYPE`);i++,s=``}else if(e[t]===`>`){if(o?e[t-1]===`-`&&e[t-2]===`-`&&(o=!1,i--):i--,i===0)break}else e[t]===`[`?a=!0:s+=e[t];if(i!==0)throw Error(`Unclosed DOCTYPE`)}else throw Error(`Invalid Tag instead of DOCTYPE`);return{entities:n,i:t}}readEntityExp(e,t){t=N(e,t);let n=t;for(;t<e.length&&!/\s/.test(e[t])&&e[t]!==`"`&&e[t]!==`'`;)t++;let r=e.substring(n,t);if(M(r),t=N(e,t),!this.suppressValidationErr){if(e.substring(t,t+6).toUpperCase()===`SYSTEM`)throw Error(`External entities are not supported`);if(e[t]===`%`)throw Error(`Parameter entities are not supported`)}let i=``;if([t,i]=this.readIdentifierVal(e,t,`entity`),this.options.enabled!==!1&&this.options.maxEntitySize!=null&&i.length>this.options.maxEntitySize)throw Error(`Entity "${r}" size (${i.length}) exceeds maximum allowed size (${this.options.maxEntitySize})`);return t--,[r,i,t]}readNotationExp(e,t){t=N(e,t);let n=t;for(;t<e.length&&!/\s/.test(e[t]);)t++;let r=e.substring(n,t);!this.suppressValidationErr&&M(r),t=N(e,t);let i=e.substring(t,t+6).toUpperCase();if(!this.suppressValidationErr&&i!==`SYSTEM`&&i!==`PUBLIC`)throw Error(`Expected SYSTEM or PUBLIC, found "${i}"`);t+=i.length,t=N(e,t);let a=null,o=null;if(i===`PUBLIC`)[t,a]=this.readIdentifierVal(e,t,`publicIdentifier`),t=N(e,t),(e[t]===`"`||e[t]===`'`)&&([t,o]=this.readIdentifierVal(e,t,`systemIdentifier`));else if(i===`SYSTEM`&&([t,o]=this.readIdentifierVal(e,t,`systemIdentifier`),!this.suppressValidationErr&&!o))throw Error(`Missing mandatory system identifier for SYSTEM notation`);return{notationName:r,publicIdentifier:a,systemIdentifier:o,index:--t}}readIdentifierVal(e,t,n){let r=``,i=e[t];if(i!==`"`&&i!==`'`)throw Error(`Expected quoted string, found "${i}"`);t++;let a=t;for(;t<e.length&&e[t]!==i;)t++;if(r=e.substring(a,t),e[t]!==i)throw Error(`Unterminated ${n} value`);return t++,[t,r]}readElementExp(e,t){t=N(e,t);let n=t;for(;t<e.length&&!/\s/.test(e[t]);)t++;let r=e.substring(n,t);if(!this.suppressValidationErr&&!y(r))throw Error(`Invalid element name: "${r}"`);t=N(e,t);let i=``;if(e[t]===`E`&&j(e,`MPTY`,t))t+=4;else if(e[t]===`A`&&j(e,`NY`,t))t+=2;else if(e[t]===`(`){t++;let n=t;for(;t<e.length&&e[t]!==`)`;)t++;if(i=e.substring(n,t),e[t]!==`)`)throw Error(`Unterminated content model`)}else if(!this.suppressValidationErr)throw Error(`Invalid Element Expression, found "${e[t]}"`);return{elementName:r,contentModel:i.trim(),index:t}}readAttlistExp(e,t){t=N(e,t);let n=t;for(;t<e.length&&!/\s/.test(e[t]);)t++;let r=e.substring(n,t);for(M(r),t=N(e,t),n=t;t<e.length&&!/\s/.test(e[t]);)t++;let i=e.substring(n,t);if(!M(i))throw Error(`Invalid attribute name: "${i}"`);t=N(e,t);let a=``;if(e.substring(t,t+8).toUpperCase()===`NOTATION`){if(a=`NOTATION`,t+=8,t=N(e,t),e[t]!==`(`)throw Error(`Expected '(', found "${e[t]}"`);t++;let n=[];for(;t<e.length&&e[t]!==`)`;){let r=t;for(;t<e.length&&e[t]!==`|`&&e[t]!==`)`;)t++;let i=e.substring(r,t);if(i=i.trim(),!M(i))throw Error(`Invalid notation name: "${i}"`);n.push(i),e[t]===`|`&&(t++,t=N(e,t))}if(e[t]!==`)`)throw Error(`Unterminated list of notations`);t++,a+=` (`+n.join(`|`)+`)`}else{let n=t;for(;t<e.length&&!/\s/.test(e[t]);)t++;if(a+=e.substring(n,t),!this.suppressValidationErr&&![`CDATA`,`ID`,`IDREF`,`IDREFS`,`ENTITY`,`ENTITIES`,`NMTOKEN`,`NMTOKENS`].includes(a.toUpperCase()))throw Error(`Invalid attribute type: "${a}"`)}t=N(e,t);let o=``;return e.substring(t,t+8).toUpperCase()===`#REQUIRED`?(o=`#REQUIRED`,t+=8):e.substring(t,t+7).toUpperCase()===`#IMPLIED`?(o=`#IMPLIED`,t+=7):[t,o]=this.readIdentifierVal(e,t,`ATTLIST`),{elementName:r,attributeName:i,attributeType:a,defaultValue:o,index:t}}},N=(e,t)=>{for(;t<e.length&&/\s/.test(e[t]);)t++;return t}}));function ct(e,t={}){if(t=Object.assign({},ht,t),!e||typeof e!=`string`)return e;let n=e.trim();if(n.length===0||t.skipLike!==void 0&&t.skipLike.test(n))return e;if(n===`0`)return 0;if(t.hex&&pt.test(n))return dt(n,16);if(!isFinite(n))return ft(e,Number(n),t);if(n.includes(`e`)||n.includes(`E`))return lt(e,n,t);{let r=mt.exec(n);if(r){let i=r[1]||``,a=r[2],o=ut(r[3]),s=i?e[a.length+1]===`.`:e[a.length]===`.`;if(!t.leadingZeros&&(a.length>1||a.length===1&&!s))return e;{let r=Number(n),s=String(r);if(r===0)return r;if(s.search(/[eE]/)!==-1)return t.eNotation?r:e;if(n.indexOf(`.`)!==-1)return s===`0`||s===o||s===`${i}${o}`?r:e;let c=a?o:n;return a?c===s||i+c===s?r:e:c===s||c===i+s?r:e}}else return e}}function lt(e,t,n){if(!n.eNotation)return e;let r=t.match(gt);if(r){let i=r[1]||``,a=r[3].indexOf(`e`)===-1?`E`:`e`,o=r[2],s=i?e[o.length+1]===a:e[o.length]===a;return o.length>1&&s?e:o.length===1&&(r[3].startsWith(`.${a}`)||r[3][0]===a)?Number(t):o.length>0?n.leadingZeros&&!s?(t=(r[1]||``)+r[3],Number(t)):e:Number(t)}else return e}function ut(e){return e&&e.indexOf(`.`)!==-1?(e=e.replace(/0+$/,``),e===`.`?e=`0`:e[0]===`.`?e=`0`+e:e[e.length-1]===`.`&&(e=e.substring(0,e.length-1)),e):e}function dt(e,t){if(parseInt)return parseInt(e,t);if(Number.parseInt)return Number.parseInt(e,t);if(window&&window.parseInt)return window.parseInt(e,t);throw Error(`parseInt, Number.parseInt, window.parseInt are not supported`)}function ft(e,t,n){let r=t===1/0;switch(n.infinity.toLowerCase()){case`null`:return null;case`infinity`:return t;case`string`:return r?`Infinity`:`-Infinity`;default:return e}}var pt,mt,ht,gt,_t=e((()=>{pt=/^[-+]?0x[a-fA-F0-9]+$/,mt=/^([\-\+])?(0*)([0-9]*(\.[0-9]*)?)$/,ht={hex:!0,leadingZeros:!0,decimalPoint:`.`,eNotation:!0,infinity:`original`},gt=/^([-+])?(0*)(\d*(\.\d*)?[eE][-\+]?\d+)$/}));function vt(e){return typeof e==`function`?e:Array.isArray(e)?t=>{for(let n of e)if(typeof n==`string`&&t===n||n instanceof RegExp&&n.test(t))return!0}:()=>!1}var yt=e((()=>{})),P,bt=e((()=>{P=class{constructor(e,t={},n){this.pattern=e,this.separator=t.separator||`.`,this.segments=this._parse(e),this.data=n,this._hasDeepWildcard=this.segments.some(e=>e.type===`deep-wildcard`),this._hasAttributeCondition=this.segments.some(e=>e.attrName!==void 0),this._hasPositionSelector=this.segments.some(e=>e.position!==void 0)}_parse(e){let t=[],n=0,r=``;for(;n<e.length;)e[n]===this.separator?n+1<e.length&&e[n+1]===this.separator?(r.trim()&&(t.push(this._parseSegment(r.trim())),r=``),t.push({type:`deep-wildcard`}),n+=2):(r.trim()&&t.push(this._parseSegment(r.trim())),r=``,n++):(r+=e[n],n++);return r.trim()&&t.push(this._parseSegment(r.trim())),t}_parseSegment(e){let t={type:`tag`},n=null,r=e,i=e.match(/^([^\[]+)(\[[^\]]*\])(.*)$/);if(i&&(r=i[1]+i[3],i[2])){let e=i[2].slice(1,-1);e&&(n=e)}let a,o=r;if(r.includes(`::`)){let t=r.indexOf(`::`);if(a=r.substring(0,t).trim(),o=r.substring(t+2).trim(),!a)throw Error(`Invalid namespace in pattern: ${e}`)}let s,c=null;if(o.includes(`:`)){let e=o.lastIndexOf(`:`),t=o.substring(0,e).trim(),n=o.substring(e+1).trim();[`first`,`last`,`odd`,`even`].includes(n)||/^nth\(\d+\)$/.test(n)?(s=t,c=n):s=o}else s=o;if(!s)throw Error(`Invalid segment pattern: ${e}`);if(t.tag=s,a&&(t.namespace=a),n)if(n.includes(`=`)){let e=n.indexOf(`=`);t.attrName=n.substring(0,e).trim(),t.attrValue=n.substring(e+1).trim()}else t.attrName=n.trim();if(c){let e=c.match(/^nth\((\d+)\)$/);e?(t.position=`nth`,t.positionValue=parseInt(e[1],10)):t.position=c}return t}get length(){return this.segments.length}hasDeepWildcard(){return this._hasDeepWildcard}hasAttributeCondition(){return this._hasAttributeCondition}hasPositionSelector(){return this._hasPositionSelector}toString(){return this.pattern}}})),xt,St=e((()=>{xt=class{constructor(){this._byDepthAndTag=new Map,this._wildcardByDepth=new Map,this._deepWildcards=[],this._patterns=new Set,this._sealed=!1}add(e){if(this._sealed)throw TypeError(`ExpressionSet is sealed. Create a new ExpressionSet to add more expressions.`);if(this._patterns.has(e.pattern))return this;if(this._patterns.add(e.pattern),e.hasDeepWildcard())return this._deepWildcards.push(e),this;let t=e.length,n=e.segments[e.segments.length-1]?.tag;if(!n||n===`*`)this._wildcardByDepth.has(t)||this._wildcardByDepth.set(t,[]),this._wildcardByDepth.get(t).push(e);else{let r=`${t}:${n}`;this._byDepthAndTag.has(r)||this._byDepthAndTag.set(r,[]),this._byDepthAndTag.get(r).push(e)}return this}addAll(e){for(let t of e)this.add(t);return this}has(e){return this._patterns.has(e.pattern)}get size(){return this._patterns.size}seal(){return this._sealed=!0,this}get isSealed(){return this._sealed}matchesAny(e){return this.findMatch(e)!==null}findMatch(e){let t=e.getDepth(),n=`${t}:${e.getCurrentTag()}`,r=this._byDepthAndTag.get(n);if(r){for(let t=0;t<r.length;t++)if(e.matches(r[t]))return r[t]}let i=this._wildcardByDepth.get(t);if(i){for(let t=0;t<i.length;t++)if(e.matches(i[t]))return i[t]}for(let t=0;t<this._deepWildcards.length;t++)if(e.matches(this._deepWildcards[t]))return this._deepWildcards[t];return null}}})),Ct,F,wt=e((()=>{Ct=class{constructor(e){this._matcher=e}get separator(){return this._matcher.separator}getCurrentTag(){let e=this._matcher.path;return e.length>0?e[e.length-1].tag:void 0}getCurrentNamespace(){let e=this._matcher.path;return e.length>0?e[e.length-1].namespace:void 0}getAttrValue(e){let t=this._matcher.path;if(t.length!==0)return t[t.length-1].values?.[e]}hasAttr(e){let t=this._matcher.path;if(t.length===0)return!1;let n=t[t.length-1];return n.values!==void 0&&e in n.values}getPosition(){let e=this._matcher.path;return e.length===0?-1:e[e.length-1].position??0}getCounter(){let e=this._matcher.path;return e.length===0?-1:e[e.length-1].counter??0}getIndex(){return this.getPosition()}getDepth(){return this._matcher.path.length}toString(e,t=!0){return this._matcher.toString(e,t)}toArray(){return this._matcher.path.map(e=>e.tag)}matches(e){return this._matcher.matches(e)}matchesAny(e){return e.matchesAny(this._matcher)}},F=class{constructor(e={}){this.separator=e.separator||`.`,this.path=[],this.siblingStacks=[],this._pathStringCache=null,this._view=new Ct(this)}push(e,t=null,n=null){this._pathStringCache=null,this.path.length>0&&(this.path[this.path.length-1].values=void 0);let r=this.path.length;this.siblingStacks[r]||(this.siblingStacks[r]=new Map);let i=this.siblingStacks[r],a=n?`${n}:${e}`:e,o=i.get(a)||0,s=0;for(let e of i.values())s+=e;i.set(a,o+1);let c={tag:e,position:s,counter:o};n!=null&&(c.namespace=n),t!=null&&(c.values=t),this.path.push(c)}pop(){if(this.path.length===0)return;this._pathStringCache=null;let e=this.path.pop();return this.siblingStacks.length>this.path.length+1&&(this.siblingStacks.length=this.path.length+1),e}updateCurrent(e){if(this.path.length>0){let t=this.path[this.path.length-1];e!=null&&(t.values=e)}}getCurrentTag(){return this.path.length>0?this.path[this.path.length-1].tag:void 0}getCurrentNamespace(){return this.path.length>0?this.path[this.path.length-1].namespace:void 0}getAttrValue(e){if(this.path.length!==0)return this.path[this.path.length-1].values?.[e]}hasAttr(e){if(this.path.length===0)return!1;let t=this.path[this.path.length-1];return t.values!==void 0&&e in t.values}getPosition(){return this.path.length===0?-1:this.path[this.path.length-1].position??0}getCounter(){return this.path.length===0?-1:this.path[this.path.length-1].counter??0}getIndex(){return this.getPosition()}getDepth(){return this.path.length}toString(e,t=!0){let n=e||this.separator;if(n===this.separator&&t===!0){if(this._pathStringCache!==null)return this._pathStringCache;let e=this.path.map(e=>e.namespace?`${e.namespace}:${e.tag}`:e.tag).join(n);return this._pathStringCache=e,e}return this.path.map(e=>t&&e.namespace?`${e.namespace}:${e.tag}`:e.tag).join(n)}toArray(){return this.path.map(e=>e.tag)}reset(){this._pathStringCache=null,this.path=[],this.siblingStacks=[]}matches(e){let t=e.segments;return t.length===0?!1:e.hasDeepWildcard()?this._matchWithDeepWildcard(t):this._matchSimple(t)}_matchSimple(e){if(this.path.length!==e.length)return!1;for(let t=0;t<e.length;t++)if(!this._matchSegment(e[t],this.path[t],t===this.path.length-1))return!1;return!0}_matchWithDeepWildcard(e){let t=this.path.length-1,n=e.length-1;for(;n>=0&&t>=0;){let r=e[n];if(r.type===`deep-wildcard`){if(n--,n<0)return!0;let r=e[n],i=!1;for(let e=t;e>=0;e--)if(this._matchSegment(r,this.path[e],e===this.path.length-1)){t=e-1,n--,i=!0;break}if(!i)return!1}else{if(!this._matchSegment(r,this.path[t],t===this.path.length-1))return!1;t--,n--}}return n<0}_matchSegment(e,t,n){if(e.tag!==`*`&&e.tag!==t.tag||e.namespace!==void 0&&e.namespace!==`*`&&e.namespace!==t.namespace||e.attrName!==void 0&&(!n||!t.values||!(e.attrName in t.values)||e.attrValue!==void 0&&String(t.values[e.attrName])!==String(e.attrValue)))return!1;if(e.position!==void 0){if(!n)return!1;let r=t.counter??0;if(e.position===`first`&&r!==0||e.position===`odd`&&r%2!=1||e.position===`even`&&r%2!=0||e.position===`nth`&&r!==e.positionValue)return!1}return!0}matchesAny(e){return e.matchesAny(this)}snapshot(){return{path:this.path.map(e=>({...e})),siblingStacks:this.siblingStacks.map(e=>new Map(e))}}restore(e){this._pathStringCache=null,this.path=e.path.map(e=>({...e})),this.siblingStacks=e.siblingStacks.map(e=>new Map(e))}readOnly(){return this._view}}})),Tt=e((()=>{bt(),wt(),St()}));function Et(e,t){if(!e)return{};let n=t.attributesGroupName?e[t.attributesGroupName]:e;if(!n)return{};let r={};for(let e in n)if(e.startsWith(t.attributeNamePrefix)){let i=e.substring(t.attributeNamePrefix.length);r[i]=n[e]}else r[e]=n[e];return r}function Dt(e){if(!e||typeof e!=`string`)return;let t=e.indexOf(`:`);if(t!==-1&&t>0){let n=e.substring(0,t);if(n!==`xmlns`)return n}}function Ot(e,t,n,r,i,a,o){let s=this.options;if(e!==void 0&&(s.trimValues&&!r&&(e=e.trim()),e.length>0)){o||(e=this.replaceEntitiesValue(e,t,n));let r=s.jPath?n.toString():n,c=s.tagValueProcessor(t,e,r,i,a);return c==null?e:typeof c!=typeof e||c!==e?c:s.trimValues||e.trim()===e?zt(e,s.parseTagValue,s.numberParseOptions):e}}function kt(e){if(this.options.removeNSPrefix){let t=e.split(`:`),n=e.charAt(0)===`/`?`/`:``;if(t[0]===`xmlns`)return``;t.length===2&&(e=n+t[1])}return e}function At(e,t,n,r=!1){let i=this.options;if(r===!0||i.ignoreAttributes!==!0&&typeof e==`string`){let r=le(e,Ut),a=r.length,o={},s=Array(a),c=!1,l={};for(let e=0;e<a;e++){let t=this.resolveNameSpace(r[e][1]),a=r[e][4];if(t.length&&a!==void 0){let r=a;i.trimValues&&(r=r.trim()),r=this.replaceEntitiesValue(r,n,this.readonlyMatcher),s[e]=r,l[t]=r,c=!0}}c&&typeof t==`object`&&t.updateCurrent&&t.updateCurrent(l);let u=i.jPath?t.toString():this.readonlyMatcher,d=!1;for(let e=0;e<a;e++){let t=this.resolveNameSpace(r[e][1]);if(this.ignoreAttributesFn(t,u))continue;let n=i.attributeNamePrefix+t;if(t.length)if(i.transformAttributeName&&(n=i.transformAttributeName(n)),n=Vt(n,i),r[e][4]!==void 0){let r=s[e],a=i.attributeValueProcessor(t,r,u);a==null?o[n]=r:typeof a!=typeof r||a!==r?o[n]=a:o[n]=zt(r,i.parseAttributeValue,i.numberParseOptions),d=!0}else i.allowBooleanAttributes&&(o[n]=!0,d=!0)}if(!d)return;if(i.attributesGroupName&&!i.preserveOrder){let e={};return e[i.attributesGroupName]=o,e}return o}}function jt(e,t,n,r){this.options.captureMetaData||(r=void 0);let i=this.options.jPath?n.toString():n,a=this.options.updateTag(t.tagname,i,t[`:@`]);a===!1||(typeof a==`string`&&(t.tagname=a),e.addChild(t,r))}function Mt(e,t,n){let r=this.options.processEntities;if(!r||!r.enabled)return e;if(r.allowedTags){let i=this.options.jPath?n.toString():n;if(!(Array.isArray(r.allowedTags)?r.allowedTags.includes(t):r.allowedTags(t,i)))return e}if(r.tagFilter){let i=this.options.jPath?n.toString():n;if(!r.tagFilter(t,i))return e}return this.entityDecoder.decode(e)}function Nt(e,t,n,r){return e&&=(r===void 0&&(r=t.child.length===0),e=this.parseTextData(e,t.tagname,n,!1,t[`:@`]?Object.keys(t[`:@`]).length!==0:!1,r),e!==void 0&&e!==``&&t.add(this.options.textNodeName,e),``),e}function Pt(){return this.stopNodeExpressionsSet.size===0?!1:this.matcher.matchesAny(this.stopNodeExpressionsSet)}function Ft(e,t,n=`>`){let r=0,i=e.length,a=n.charCodeAt(0),o=n.length>1?n.charCodeAt(1):-1,s=``,c=t;for(let n=t;n<i;n++){let t=e.charCodeAt(n);if(r)t===r&&(r=0);else if(t===34||t===39)r=t;else if(t===a)if(o!==-1){if(e.charCodeAt(n+1)===o)return s+=e.substring(c,n),{data:s,index:n}}else return s+=e.substring(c,n),{data:s,index:n};else t===9&&!r&&(s+=e.substring(c,n)+` `,c=n+1)}}function I(e,t,n,r){let i=e.indexOf(t,n);if(i===-1)throw Error(r);return i+t.length-1}function It(e,t,n,r){let i=e.indexOf(t,n);if(i===-1)throw Error(r);return i}function Lt(e,t,n,r=`>`){let i=Ft(e,t+1,r);if(!i)return;let a=i.data,o=i.index,s=a.search(/\s/),c=a,l=!0;s!==-1&&(c=a.substring(0,s),a=a.substring(s+1).trimStart());let u=c;if(n){let e=c.indexOf(`:`);e!==-1&&(c=c.substr(e+1),l=c!==i.data.substr(e+1))}return{tagName:c,tagExp:a,closeIndex:o,attrExpPresent:l,rawTagName:u}}function Rt(e,t,n){let r=n,i=1,a=e.length;for(;n<a;n++)if(e[n]===`<`){let a=e.charCodeAt(n+1);if(a===47){let a=It(e,`>`,n,`${t} is not closed`);if(e.substring(n+2,a).trim()===t&&(i--,i===0))return{tagContent:e.substring(r,n),i:a};n=a}else if(a===63)n=I(e,`?>`,n+1,`StopNode is not closed.`);else if(a===33&&e.charCodeAt(n+2)===45&&e.charCodeAt(n+3)===45)n=I(e,`-->`,n+3,`StopNode is not closed.`);else if(a===33&&e.charCodeAt(n+2)===91)n=I(e,`]]>`,n,`StopNode is not closed.`)-2;else{let r=Lt(e,n,!1);r&&((r&&r.tagName)===t&&r.tagExp[r.tagExp.length-1]!==`/`&&i++,n=r.closeIndex)}}}function zt(e,t,n){if(t&&typeof e==`string`){let t=e.trim();return t===`true`?!0:t===`false`?!1:ct(e,n)}else if(ue(e))return e;else return``}function Bt(e,t,n,r){if(e){let r=e(t);n===t&&(n=r),t=r}return t=Vt(t,r),{tagName:t,tagExp:n}}function Vt(e,t){if(fe.includes(e))throw Error(`[SECURITY] Invalid name: "${e}" is a reserved JavaScript keyword that could cause prototype pollution`);return b.includes(e)?t.onDangerousProperty(e):e}var Ht,Ut,Wt,Gt=e((()=>{x(),at(),st(),_t(),yt(),Tt(),Ze(),Ht=class{constructor(e,t){this.options=e,this.currentNode=null,this.tagsNodeStack=[],this.parseXml=Wt,this.parseTextData=Ot,this.resolveNameSpace=kt,this.buildAttributesMap=At,this.isItStopNode=Pt,this.replaceEntitiesValue=Mt,this.readStopNodeData=Rt,this.saveTextToParentTag=Nt,this.addChild=jt,this.ignoreAttributesFn=vt(this.options.ignoreAttributes),this.entityExpansionCount=0,this.currentExpandedLength=0;let n={...Be};this.options.entityDecoder?this.entityDecoder=this.options.entityDecoder:(typeof this.options.htmlEntities==`object`?n=this.options.htmlEntities:this.options.htmlEntities===!0&&(n={...Ve,...T}),this.entityDecoder=new Ye({namedEntities:{...n,...t},numericAllowed:this.options.htmlEntities,limit:{maxTotalExpansions:this.options.processEntities.maxTotalExpansions,maxExpandedLength:this.options.processEntities.maxExpandedLength,applyLimitsTo:this.options.processEntities.appliesTo}})),this.matcher=new F,this.readonlyMatcher=this.matcher.readOnly(),this.isCurrentNodeStopNode=!1,this.stopNodeExpressionsSet=new xt;let r=this.options.stopNodes;if(r&&r.length>0){for(let e=0;e<r.length;e++){let t=r[e];typeof t==`string`?this.stopNodeExpressionsSet.add(new P(t)):t instanceof P&&this.stopNodeExpressionsSet.add(t)}this.stopNodeExpressionsSet.seal()}}},Ut=RegExp(`([^\\s=]+)\\s*(=\\s*(['"])([\\s\\S]*?)\\3)?`,`gm`),Wt=function(e){e=e.replace(/\r\n?/g,`
`);let t=new A(`!xml`),n=t,r=``;this.matcher.reset(),this.entityDecoder.reset(),this.entityExpansionCount=0,this.currentExpandedLength=0;let i=this.options,a=new ot(i.processEntities),o=e.length;for(let s=0;s<o;s++)if(e[s]===`<`){let c=e.charCodeAt(s+1);if(c===47){let t=I(e,`>`,s,`Closing Tag is not closed.`),a=e.substring(s+2,t).trim();if(i.removeNSPrefix){let e=a.indexOf(`:`);e!==-1&&(a=a.substr(e+1))}a=Bt(i.transformTagName,a,``,i).tagName,n&&(r=this.saveTextToParentTag(r,n,this.readonlyMatcher));let o=this.matcher.getCurrentTag();if(a&&i.unpairedTagsSet.has(a))throw Error(`Unpaired tag can not be used as closing tag: </${a}>`);o&&i.unpairedTagsSet.has(o)&&(this.matcher.pop(),this.tagsNodeStack.pop()),this.matcher.pop(),this.isCurrentNodeStopNode=!1,n=this.tagsNodeStack.pop(),r=``,s=t}else if(c===63){let t=Lt(e,s,!1,`?>`);if(!t)throw Error(`Pi Tag is not closed.`);r=this.saveTextToParentTag(r,n,this.readonlyMatcher);let a=this.buildAttributesMap(t.tagExp,this.matcher,t.tagName,!0);if(a){let e=a[this.options.attributeNamePrefix+`version`];this.entityDecoder.setXmlVersion(Number(e)||1)}if(!(i.ignoreDeclaration&&t.tagName===`?xml`||i.ignorePiTags)){let e=new A(t.tagName);e.add(i.textNodeName,``),t.tagName!==t.tagExp&&t.attrExpPresent&&i.ignoreAttributes!==!0&&(e[`:@`]=a),this.addChild(n,e,this.readonlyMatcher,s)}s=t.closeIndex+1}else if(c===33&&e.charCodeAt(s+2)===45&&e.charCodeAt(s+3)===45){let t=I(e,`-->`,s+4,`Comment is not closed.`);if(i.commentPropName){let a=e.substring(s+4,t-2);r=this.saveTextToParentTag(r,n,this.readonlyMatcher),n.add(i.commentPropName,[{[i.textNodeName]:a}])}s=t}else if(c===33&&e.charCodeAt(s+2)===68){let t=a.readDocType(e,s);this.entityDecoder.addInputEntities(t.entities),s=t.i}else if(c===33&&e.charCodeAt(s+2)===91){let t=I(e,`]]>`,s,`CDATA is not closed.`)-2,a=e.substring(s+9,t);r=this.saveTextToParentTag(r,n,this.readonlyMatcher);let o=this.parseTextData(a,n.tagname,this.readonlyMatcher,!0,!1,!0,!0);o??=``,i.cdataPropName?n.add(i.cdataPropName,[{[i.textNodeName]:a}]):n.add(i.textNodeName,o),s=t+2}else{let a=Lt(e,s,i.removeNSPrefix);if(!a){let t=e.substring(Math.max(0,s-50),Math.min(o,s+50));throw Error(`readTagExp returned undefined at position ${s}. Context: "${t}"`)}let c=a.tagName,l=a.rawTagName,u=a.tagExp,d=a.attrExpPresent,f=a.closeIndex;if({tagName:c,tagExp:u}=Bt(i.transformTagName,c,u,i),i.strictReservedNames&&(c===i.commentPropName||c===i.cdataPropName||c===i.textNodeName||c===i.attributesGroupName))throw Error(`Invalid tag name: ${c}`);n&&r&&n.tagname!==`!xml`&&(r=this.saveTextToParentTag(r,n,this.readonlyMatcher,!1));let p=n;p&&i.unpairedTagsSet.has(p.tagname)&&(n=this.tagsNodeStack.pop(),this.matcher.pop());let m=!1;u.length>0&&u.lastIndexOf(`/`)===u.length-1&&(m=!0,c[c.length-1]===`/`?(c=c.substr(0,c.length-1),u=c):u=u.substr(0,u.length-1),d=c!==u);let h=null,g;g=Dt(l),c!==t.tagname&&this.matcher.push(c,{},g),c!==u&&d&&(h=this.buildAttributesMap(u,this.matcher,c),h&&Et(h,i)),c!==t.tagname&&(this.isCurrentNodeStopNode=this.isItStopNode());let _=s;if(this.isCurrentNodeStopNode){let t=``;if(m)s=a.closeIndex;else if(i.unpairedTagsSet.has(c))s=a.closeIndex;else{let n=this.readStopNodeData(e,l,f+1);if(!n)throw Error(`Unexpected end of ${l}`);s=n.i,t=n.tagContent}let r=new A(c);h&&(r[`:@`]=h),r.add(i.textNodeName,t),this.matcher.pop(),this.isCurrentNodeStopNode=!1,this.addChild(n,r,this.readonlyMatcher,_)}else{if(m){({tagName:c,tagExp:u}=Bt(i.transformTagName,c,u,i));let e=new A(c);h&&(e[`:@`]=h),this.addChild(n,e,this.readonlyMatcher,_),this.matcher.pop(),this.isCurrentNodeStopNode=!1}else if(i.unpairedTagsSet.has(c)){let e=new A(c);h&&(e[`:@`]=h),this.addChild(n,e,this.readonlyMatcher,_),this.matcher.pop(),this.isCurrentNodeStopNode=!1,s=a.closeIndex;continue}else{let e=new A(c);if(this.tagsNodeStack.length>i.maxNestedTags)throw Error(`Maximum nested tags exceeded`);this.tagsNodeStack.push(n),h&&(e[`:@`]=h),this.addChild(n,e,this.readonlyMatcher,_),n=e}r=``,s=f}}}else r+=e[s];return t.child}}));function Kt(e,t){if(!e||typeof e!=`object`)return{};if(!t)return e;let n={};for(let r in e)if(r.startsWith(t)){let i=r.substring(t.length);n[i]=e[r]}else n[r]=e[r];return n}function qt(e,t,n,r){return Jt(e,t,n,r)}function Jt(e,t,n,r){let i,a={};for(let o=0;o<e.length;o++){let s=e[o],c=Yt(s);if(c!==void 0&&c!==t.textNodeName){let e=Kt(s[`:@`]||{},t.attributeNamePrefix);n.push(c,e)}if(c===t.textNodeName)i===void 0?i=s[c]:i+=``+s[c];else if(c===void 0)continue;else if(s[c]){let e=Jt(s[c],t,n,r),i=Zt(e,t);if(Object.keys(e).length===0&&t.alwaysCreateTextNode&&(e[t.textNodeName]=``),s[`:@`]?Xt(e,s[`:@`],r,t):Object.keys(e).length===1&&e[t.textNodeName]!==void 0&&!t.alwaysCreateTextNode?e=e[t.textNodeName]:Object.keys(e).length===0&&(t.alwaysCreateTextNode?e[t.textNodeName]=``:e=``),s[L]!==void 0&&typeof e==`object`&&e&&(e[L]=s[L]),a[c]!==void 0&&Object.prototype.hasOwnProperty.call(a,c))Array.isArray(a[c])||(a[c]=[a[c]]),a[c].push(e);else{let n=t.jPath?r.toString():r;t.isArray(c,n,i)?a[c]=[e]:a[c]=e}c!==void 0&&c!==t.textNodeName&&n.pop()}}return typeof i==`string`?i.length>0&&(a[t.textNodeName]=i):i!==void 0&&(a[t.textNodeName]=i),a}function Yt(e){let t=Object.keys(e);for(let e=0;e<t.length;e++){let n=t[e];if(n!==`:@`)return n}}function Xt(e,t,n,r){if(t){let i=Object.keys(t),a=i.length;for(let o=0;o<a;o++){let a=i[o],s=a.startsWith(r.attributeNamePrefix)?a.substring(r.attributeNamePrefix.length):a,c=r.jPath?n.toString()+`.`+s:n;r.isArray(a,c,!0,!0)?e[a]=[t[a]]:e[a]=t[a]}}}function Zt(e,t){let{textNodeName:n}=t,r=Object.keys(e).length;return!!(r===0||r===1&&(e[n]||typeof e[n]==`boolean`||e[n]===0))}var L,Qt=e((()=>{at(),L=A.getMetaDataSymbol()})),$t,en=e((()=>{rt(),Gt(),Qt(),De(),at(),$t=class{constructor(e){this.externalEntities={},this.options=nt(e)}parse(e,t){if(typeof e!=`string`&&e.toString)e=e.toString();else if(typeof e!=`string`)throw Error(`XML data is accepted in String or Bytes[] form.`);if(t){t===!0&&(t={});let n=pe(e,t);if(n!==!0)throw Error(`${n.err.msg}:${n.err.line}:${n.err.col}`)}let n=new Ht(this.options,this.externalEntities),r=n.parseXml(e);return this.options.preserveOrder||r===void 0?r:qt(r,this.options,n.matcher,n.readonlyMatcher)}addEntity(e,t){if(t.indexOf(`&`)!==-1)throw Error(`Entity value can't have '&'`);if(e.indexOf(`&`)!==-1||e.indexOf(`;`)!==-1)throw Error(`An entity must be set without '&' and ';'. Eg. use '#xD' for '&#xD;'`);if(t===`&`)throw Error(`An entity with value '&' is not permitted`);this.externalEntities[e]=t}static getMetaDataSymbol(){return A.getMetaDataSymbol()}}}));function tn(e){return String(e).replace(/--/g,`- -`).replace(/--/g,`- -`).replace(/-$/,`- `)}function nn(e){return String(e).replace(/\]\]>/g,`]]]]><![CDATA[>`)}function R(e){return String(e).replace(/"/g,`&quot;`).replace(/'/g,`&apos;`)}var rn=e((()=>{}));function an(e,t){let n=``;t.format&&(n=mn);let r=[];if(t.stopNodes&&Array.isArray(t.stopNodes))for(let e=0;e<t.stopNodes.length;e++){let n=t.stopNodes[e];typeof n==`string`?r.push(new P(n)):n instanceof P&&r.push(n)}let i=new F;return on(e,t,n,i,r)}function on(e,t,n,r,i){let a=``,o=!1;if(t.maxNestedTags&&r.getDepth()>t.maxNestedTags)throw Error(`Maximum nested tags exceeded`);if(!Array.isArray(e)){if(e!=null){let n=e.toString();return n=pn(n,t),n}return``}for(let s=0;s<e.length;s++){let c=e[s],l=un(c);if(l===void 0)continue;let u=sn(c[`:@`],t);r.push(l,u);let d=fn(r,i);if(l===t.textNodeName){let e=c[l];d||(e=t.tagValueProcessor(l,e),e=pn(e,t)),o&&(a+=n),a+=e,o=!1,r.pop();continue}else if(l===t.cdataPropName){o&&(a+=n);let e=c[l][0][t.textNodeName],i=nn(e);a+=`<![CDATA[${i}]]>`,o=!1,r.pop();continue}else if(l===t.commentPropName){let e=c[l][0][t.textNodeName],i=tn(e);a+=n+`<!--${i}-->`,o=!0,r.pop();continue}else if(l[0]===`?`){let e=dn(c[`:@`],t,d);a+=(l===`?xml`?``:n)+`<${l}${e}?>`,o=!0,r.pop();continue}let f=n;f!==``&&(f+=t.indentBy);let p=n+`<${l}${dn(c[`:@`],t,d)}`,m;m=d?cn(c[l],t):on(c[l],t,f,r,i),t.unpairedTags.indexOf(l)===-1?(!m||m.length===0)&&t.suppressEmptyNode?a+=p+`/>`:m&&m.endsWith(`>`)?a+=p+`>${m}${n}</${l}>`:(a+=p+`>`,m&&n!==``&&(m.includes(`/>`)||m.includes(`</`))?a+=n+t.indentBy+m+n:a+=m,a+=`</${l}>`):t.suppressUnpairedNode?a+=p+`>`:a+=p+`/>`,o=!0,r.pop()}return a}function sn(e,t){if(!e||t.ignoreAttributes)return null;let n={},r=!1;for(let i in e){if(!Object.prototype.hasOwnProperty.call(e,i))continue;let a=i.startsWith(t.attributeNamePrefix)?i.substr(t.attributeNamePrefix.length):i;n[a]=R(e[i]),r=!0}return r?n:null}function cn(e,t){if(!Array.isArray(e))return e==null?``:e.toString();let n=``;for(let r=0;r<e.length;r++){let i=e[r],a=un(i);if(a===t.textNodeName)n+=i[a];else if(a===t.cdataPropName)n+=i[a][0][t.textNodeName];else if(a===t.commentPropName)n+=i[a][0][t.textNodeName];else if(a&&a[0]===`?`)continue;else if(a){let e=ln(i[`:@`],t),r=cn(i[a],t);!r||r.length===0?n+=`<${a}${e}/>`:n+=`<${a}${e}>${r}</${a}>`}}return n}function ln(e,t){let n=``;if(e&&!t.ignoreAttributes)for(let r in e){if(!Object.prototype.hasOwnProperty.call(e,r))continue;let i=e[r];i===!0&&t.suppressBooleanAttributes?n+=` ${r.substr(t.attributeNamePrefix.length)}`:n+=` ${r.substr(t.attributeNamePrefix.length)}="${R(i)}"`}return n}function un(e){let t=Object.keys(e);for(let n=0;n<t.length;n++){let r=t[n];if(Object.prototype.hasOwnProperty.call(e,r)&&r!==`:@`)return r}}function dn(e,t,n){let r=``;if(e&&!t.ignoreAttributes)for(let i in e){if(!Object.prototype.hasOwnProperty.call(e,i))continue;let a;n?a=e[i]:(a=t.attributeValueProcessor(i,e[i]),a=pn(a,t)),a===!0&&t.suppressBooleanAttributes?r+=` ${i.substr(t.attributeNamePrefix.length)}`:r+=` ${i.substr(t.attributeNamePrefix.length)}="${R(a)}"`}return r}function fn(e,t){if(!t||t.length===0)return!1;for(let n=0;n<t.length;n++)if(e.matches(t[n]))return!0;return!1}function pn(e,t){if(e&&e.length>0&&t.processEntities)for(let n=0;n<t.entities.length;n++){let r=t.entities[n];e=e.replace(r.regex,r.val)}return e}var mn,hn=e((()=>{Tt(),rn(),mn=`
`}));function gn(e){return typeof e==`function`?e:Array.isArray(e)?t=>{for(let n of e)if(typeof n==`string`&&t===n||n instanceof RegExp&&n.test(t))return!0}:()=>!1}var _n=e((()=>{}));function z(e){if(this.options=Object.assign({},xn,e),this.options.stopNodes&&Array.isArray(this.options.stopNodes)&&(this.options.stopNodes=this.options.stopNodes.map(e=>typeof e==`string`&&e.startsWith(`*.`)?`..`+e.substring(2):e)),this.stopNodeExpressions=[],this.options.stopNodes&&Array.isArray(this.options.stopNodes))for(let e=0;e<this.options.stopNodes.length;e++){let t=this.options.stopNodes[e];typeof t==`string`?this.stopNodeExpressions.push(new P(t)):t instanceof P&&this.stopNodeExpressions.push(t)}this.options.ignoreAttributes===!0||this.options.attributesGroupName?this.isAttribute=function(){return!1}:(this.ignoreAttributesFn=gn(this.options.ignoreAttributes),this.attrPrefixLen=this.options.attributeNamePrefix.length,this.isAttribute=bn),this.processTextOrObjNode=vn,this.options.format?(this.indentate=yn,this.tagEndChar=`>
`,this.newLine=`
`):(this.indentate=function(){return``},this.tagEndChar=`>`,this.newLine=``)}function vn(e,t,n,r){let i=this.extractAttributes(e);if(r.push(t,i),this.checkStopNode(r)){let i=this.buildRawContent(e),a=this.buildAttributesForStopNode(e);return r.pop(),this.buildObjectNode(i,t,a,n)}let a=this.j2x(e,n+1,r);return r.pop(),t[0]===`?`?this.buildTextValNode(``,t,a.attrStr,n,r):e[this.options.textNodeName]!==void 0&&Object.keys(e).length===1?this.buildTextValNode(e[this.options.textNodeName],t,a.attrStr,n,r):this.buildObjectNode(a.val,t,a.attrStr,n)}function yn(e){return this.options.indentBy.repeat(e)}function bn(e){return e.startsWith(this.options.attributeNamePrefix)&&e!==this.options.textNodeName?e.substr(this.attrPrefixLen):!1}var xn,Sn=e((()=>{hn(),_n(),Tt(),rn(),xn={attributeNamePrefix:`@_`,attributesGroupName:!1,textNodeName:`#text`,ignoreAttributes:!0,cdataPropName:!1,format:!1,indentBy:`  `,suppressEmptyNode:!1,suppressUnpairedNode:!0,suppressBooleanAttributes:!0,tagValueProcessor:function(e,t){return t},attributeValueProcessor:function(e,t){return t},preserveOrder:!1,commentPropName:!1,unpairedTags:[],entities:[{regex:RegExp(`&`,`g`),val:`&amp;`},{regex:RegExp(`>`,`g`),val:`&gt;`},{regex:RegExp(`<`,`g`),val:`&lt;`},{regex:RegExp(`'`,`g`),val:`&apos;`},{regex:RegExp(`"`,`g`),val:`&quot;`}],processEntities:!0,stopNodes:[],oneListGroup:!1,maxNestedTags:100,jPath:!0},z.prototype.build=function(e){if(this.options.preserveOrder)return an(e,this.options);{Array.isArray(e)&&this.options.arrayNodeName&&this.options.arrayNodeName.length>1&&(e={[this.options.arrayNodeName]:e});let t=new F;return this.j2x(e,0,t).val}},z.prototype.j2x=function(e,t,n){let r=``,i=``;if(this.options.maxNestedTags&&n.getDepth()>=this.options.maxNestedTags)throw Error(`Maximum nested tags exceeded`);let a=this.options.jPath?n.toString():n,o=this.checkStopNode(n);for(let s in e)if(Object.prototype.hasOwnProperty.call(e,s))if(e[s]===void 0)this.isAttribute(s)&&(i+=``);else if(e[s]===null)this.isAttribute(s)||s===this.options.cdataPropName||s===this.options.commentPropName?i+=``:s[0]===`?`?i+=this.indentate(t)+`<`+s+`?`+this.tagEndChar:i+=this.indentate(t)+`<`+s+`/`+this.tagEndChar;else if(e[s]instanceof Date)i+=this.buildTextValNode(e[s],s,``,t,n);else if(typeof e[s]!=`object`){let c=this.isAttribute(s);if(c&&!this.ignoreAttributesFn(c,a))r+=this.buildAttrPairStr(c,``+e[s],o);else if(!c)if(s===this.options.textNodeName){let t=this.options.tagValueProcessor(s,``+e[s]);i+=this.replaceEntitiesValue(t)}else{n.push(s);let r=this.checkStopNode(n);if(n.pop(),r){let n=``+e[s];n===``?i+=this.indentate(t)+`<`+s+this.closeTag(s)+this.tagEndChar:i+=this.indentate(t)+`<`+s+`>`+n+`</`+s+this.tagEndChar}else i+=this.buildTextValNode(e[s],s,``,t,n)}}else if(Array.isArray(e[s])){let r=e[s].length,a=``,o=``;for(let c=0;c<r;c++){let r=e[s][c];if(r!==void 0)if(r===null)s[0]===`?`?i+=this.indentate(t)+`<`+s+`?`+this.tagEndChar:i+=this.indentate(t)+`<`+s+`/`+this.tagEndChar;else if(typeof r==`object`)if(this.options.oneListGroup){n.push(s);let e=this.j2x(r,t+1,n);n.pop(),a+=e.val,this.options.attributesGroupName&&r.hasOwnProperty(this.options.attributesGroupName)&&(o+=e.attrStr)}else a+=this.processTextOrObjNode(r,s,t,n);else if(this.options.oneListGroup){let e=this.options.tagValueProcessor(s,r);e=this.replaceEntitiesValue(e),a+=e}else{n.push(s);let e=this.checkStopNode(n);if(n.pop(),e){let e=``+r;e===``?a+=this.indentate(t)+`<`+s+this.closeTag(s)+this.tagEndChar:a+=this.indentate(t)+`<`+s+`>`+e+`</`+s+this.tagEndChar}else a+=this.buildTextValNode(r,s,``,t,n)}}this.options.oneListGroup&&(a=this.buildObjectNode(a,s,o,t)),i+=a}else if(this.options.attributesGroupName&&s===this.options.attributesGroupName){let t=Object.keys(e[s]),n=t.length;for(let i=0;i<n;i++)r+=this.buildAttrPairStr(t[i],``+e[s][t[i]],o)}else i+=this.processTextOrObjNode(e[s],s,t,n);return{attrStr:r,val:i}},z.prototype.buildAttrPairStr=function(e,t,n){return n||(t=this.options.attributeValueProcessor(e,``+t),t=this.replaceEntitiesValue(t)),this.options.suppressBooleanAttributes&&t===`true`?` `+e:` `+e+`="`+R(t)+`"`},z.prototype.extractAttributes=function(e){if(!e||typeof e!=`object`)return null;let t={},n=!1;if(this.options.attributesGroupName&&e[this.options.attributesGroupName]){let r=e[this.options.attributesGroupName];for(let e in r){if(!Object.prototype.hasOwnProperty.call(r,e))continue;let i=e.startsWith(this.options.attributeNamePrefix)?e.substring(this.options.attributeNamePrefix.length):e;t[i]=R(r[e]),n=!0}}else for(let r in e){if(!Object.prototype.hasOwnProperty.call(e,r))continue;let i=this.isAttribute(r);i&&(t[i]=R(e[r]),n=!0)}return n?t:null},z.prototype.buildRawContent=function(e){if(typeof e==`string`)return e;if(typeof e!=`object`||!e)return String(e);if(e[this.options.textNodeName]!==void 0)return e[this.options.textNodeName];let t=``;for(let n in e){if(!Object.prototype.hasOwnProperty.call(e,n)||this.isAttribute(n)||this.options.attributesGroupName&&n===this.options.attributesGroupName)continue;let r=e[n];if(n===this.options.textNodeName)t+=r;else if(Array.isArray(r)){for(let e of r)if(typeof e==`string`||typeof e==`number`)t+=`<${n}>${e}</${n}>`;else if(typeof e==`object`&&e){let r=this.buildRawContent(e),i=this.buildAttributesForStopNode(e);r===``?t+=`<${n}${i}/>`:t+=`<${n}${i}>${r}</${n}>`}}else if(typeof r==`object`&&r){let e=this.buildRawContent(r),i=this.buildAttributesForStopNode(r);e===``?t+=`<${n}${i}/>`:t+=`<${n}${i}>${e}</${n}>`}else t+=`<${n}>${r}</${n}>`}return t},z.prototype.buildAttributesForStopNode=function(e){if(!e||typeof e!=`object`)return``;let t=``;if(this.options.attributesGroupName&&e[this.options.attributesGroupName]){let n=e[this.options.attributesGroupName];for(let e in n){if(!Object.prototype.hasOwnProperty.call(n,e))continue;let r=e.startsWith(this.options.attributeNamePrefix)?e.substring(this.options.attributeNamePrefix.length):e,i=n[e];i===!0&&this.options.suppressBooleanAttributes?t+=` `+r:t+=` `+r+`="`+i+`"`}}else for(let n in e){if(!Object.prototype.hasOwnProperty.call(e,n))continue;let r=this.isAttribute(n);if(r){let i=e[n];i===!0&&this.options.suppressBooleanAttributes?t+=` `+r:t+=` `+r+`="`+i+`"`}}return t},z.prototype.buildObjectNode=function(e,t,n,r){if(e===``)return t[0]===`?`?this.indentate(r)+`<`+t+n+`?`+this.tagEndChar:this.indentate(r)+`<`+t+n+this.closeTag(t)+this.tagEndChar;if(t[0]===`?`)return this.indentate(r)+`<`+t+n+`?`+this.tagEndChar;{let i=`</`+t+this.tagEndChar,a=``;return t[0]===`?`&&(a=`?`,i=``),(n||n===``)&&e.indexOf(`<`)===-1?this.indentate(r)+`<`+t+n+a+`>`+e+i:this.options.commentPropName!==!1&&t===this.options.commentPropName&&a.length===0?this.indentate(r)+`<!--${e}-->`+this.newLine:this.indentate(r)+`<`+t+n+a+this.tagEndChar+e+this.indentate(r)+i}},z.prototype.closeTag=function(e){let t=``;return this.options.unpairedTags.indexOf(e)===-1?t=this.options.suppressEmptyNode?`/`:`></${e}`:this.options.suppressUnpairedNode||(t=`/`),t},z.prototype.checkStopNode=function(e){if(!this.stopNodeExpressions||this.stopNodeExpressions.length===0)return!1;for(let t=0;t<this.stopNodeExpressions.length;t++)if(e.matches(this.stopNodeExpressions[t]))return!0;return!1},z.prototype.buildTextValNode=function(e,t,n,r,i){if(this.options.cdataPropName!==!1&&t===this.options.cdataPropName){let t=nn(e);return this.indentate(r)+`<![CDATA[${t}]]>`+this.newLine}else if(this.options.commentPropName!==!1&&t===this.options.commentPropName){let t=tn(e);return this.indentate(r)+`<!--${t}-->`+this.newLine}else if(t[0]===`?`)return this.indentate(r)+`<`+t+n+`?`+this.tagEndChar;else{let i=this.options.tagValueProcessor(t,e);return i=this.replaceEntitiesValue(i),i===``?this.indentate(r)+`<`+t+n+this.closeTag(t)+this.tagEndChar:this.indentate(r)+`<`+t+n+`>`+i+`</`+t+this.tagEndChar}},z.prototype.replaceEntitiesValue=function(e){if(e&&e.length>0&&this.options.processEntities)for(let t=0;t<this.options.entities.length;t++){let n=this.options.entities[t];e=e.replace(n.regex,n.val)}return e}})),Cn,wn=e((()=>{Sn(),Sn(),Cn=z})),Tn=e((()=>{en(),wn()})),En,Dn=e((()=>{En=(e,t)=>t===``?void 0:{...e,value:t}}));function On(e,t,n){let r=e.parseNeTEx(t),i=n===void 0?r[0]:r.find(e=>e.attr_id===n);if(n!==void 0&&!i)throw Error(`DeckPlan ${n} not found in document`);let a=i?.decks??[];return a.length>0?{decks:a,isGhost:!1}:{decks:e.parseNeTEx(`<?xml version="1.0" encoding="UTF-8"?><PublicationDelivery xmlns="http://www.netex.org.uk/netex"><dataObjects><CompositeFrame version="1" id="GHOST:CompositeFrame:1"><frames><ResourceFrame version="1" id="GHOST:ResourceFrame:1"><deckPlans><DeckPlan version="1" id="GHOST:DeckPlan:1"><decks><Deck id="Deck/id/1" version="any"><spotRows><SpotRow id="SpotRow/id/1" /><SpotRow id="SpotRow/id/2" /><SpotRow id="SpotRow/id/3" /><SpotRow id="SpotRow/id/4" /><SpotRow id="SpotRow/id/5" /><SpotRow id="SpotRow/id/6" /><SpotRow id="SpotRow/id/7" /><SpotRow id="SpotRow/id/8" /><SpotRow id="SpotRow/id/9" /><SpotRow id="SpotRow/id/10" /><SpotRow id="SpotRow/id/11" /><SpotRow id="spot_row_1778936985294" /><SpotRow id="spot_row_1778936986382" /><SpotRow id="spot_row_1778936986822" /><SpotRow id="spot_row_1778936987173" /><SpotRow id="spot_row_1778936987614" /><SpotRow id="spot_row_1778936988038" /><SpotRow id="spot_row_1778936988454" /><SpotRow id="spot_row_1778936988839" /><SpotRow id="spot_row_1778936989382" /><SpotRow id="spot_row_1778949628771" /><SpotRow id="spot_row_1778949629523" /></spotRows><spotColumns><SpotColumn id="SpotColumn/id/A" /><SpotColumn id="SpotColumn/id/B" /><SpotColumn id="SpotColumn/id/C" /><SpotColumn id="SpotColumn/id/D" /><SpotColumn id="spot_column_1778936952743" /></spotColumns><deckSpaces><PassengerSpace id="space_1778949529557" version="1.0"><Name>Main Space</Name><SmokingAllowed>false</SmokingAllowed><StandingAllowed>true</StandingAllowed><PassengerSpaceType>seatingArea</PassengerSpaceType><passengerSpots><PassengerSpot id="seat_1778949525378" version="1.0"><Label>144</Label><Orientation>forwards</Orientation><actualVehicleEquipments /><SpotColumnRef ref="SpotColumn/id/D" version="1.0" /><SpotRowRef ref="SpotRow/id/2" version="1.0" /><Centroid><Location><pos>2.1352564102564098 0.585</pos></Location></Centroid><Width>0.35</Width><Length>0.35</Length></PassengerSpot><PassengerSpot id="seat_1778949529558" version="1.0"><Label>143</Label><Orientation>forwards</Orientation><actualVehicleEquipments /><SpotColumnRef ref="spot_column_1778936952743" version="1.0" /><SpotRowRef ref="SpotRow/id/2" version="1.0" /><IsByWindow>true</IsByWindow><Centroid><Location><pos>2.1352564102564098 0.23</pos></Location></Centroid><Width>0.35</Width><Length>0.35</Length></PassengerSpot><PassengerSpot id="seat_1778949530908" version="1.0"><Label>140</Label><Orientation>forwards</Orientation><actualVehicleEquipments /><SpotColumnRef ref="SpotColumn/id/D" version="1.0" /><SpotRowRef ref="SpotRow/id/3" version="1.0" /><Centroid><Location><pos>2.6804487179487166 0.585</pos></Location></Centroid><Width>0.35</Width><Length>0.35</Length></PassengerSpot><PassengerSpot id="seat_1778949532995" version="1.0"><Label>139</Label><Orientation>forwards</Orientation><actualVehicleEquipments /><SpotColumnRef ref="spot_column_1778936952743" version="1.0" /><SpotRowRef ref="SpotRow/id/3" version="1.0" /><IsByWindow>true</IsByWindow><Centroid><Location><pos>2.6804487179487166 0.23</pos></Location></Centroid><Width>0.35</Width><Length>0.35</Length></PassengerSpot><PassengerSpot id="seat_1778949534364" version="1.0"><Label>141</Label><Orientation>forwards</Orientation><actualVehicleEquipments /><SpotColumnRef ref="SpotColumn/id/A" version="1.0" /><SpotRowRef ref="SpotRow/id/3" version="1.0" /><IsByWindow>true</IsByWindow><Centroid><Location><pos>2.6804487179487166 1.775</pos></Location></Centroid><Width>0.35</Width><Length>0.35</Length></PassengerSpot><PassengerSpot id="seat_1778949536061" version="1.0"><Label>136</Label><Orientation>forwards</Orientation><actualVehicleEquipments /><SpotColumnRef ref="SpotColumn/id/D" version="1.0" /><SpotRowRef ref="SpotRow/id/4" version="1.0" /><Centroid><Location><pos>3.2535256410256403 0.585</pos></Location></Centroid><Width>0.35</Width><Length>0.35</Length></PassengerSpot><PassengerSpot id="seat_1778949538308" version="1.0"><Label>135</Label><Orientation>forwards</Orientation><actualVehicleEquipments /><SpotColumnRef ref="spot_column_1778936952743" version="1.0" /><SpotRowRef ref="SpotRow/id/4" version="1.0" /><IsByWindow>true</IsByWindow><Centroid><Location><pos>3.2535256410256403 0.23</pos></Location></Centroid><Width>0.35</Width><Length>0.35</Length></PassengerSpot><PassengerSpot id="seat_1778949539995" version="1.0"><Label>132</Label><Orientation>forwards</Orientation><actualVehicleEquipments /><SpotColumnRef ref="SpotColumn/id/D" version="1.0" /><SpotRowRef ref="SpotRow/id/5" version="1.0" /><Centroid><Location><pos>3.8573717948717934 0.585</pos></Location></Centroid><Width>0.35</Width><Length>0.35</Length></PassengerSpot><PassengerSpot id="seat_1778949542324" version="1.0"><Label>131</Label><Orientation>forwards</Orientation><actualVehicleEquipments /><SpotColumnRef ref="spot_column_1778936952743" version="1.0" /><SpotRowRef ref="SpotRow/id/5" version="1.0" /><IsByWindow>true</IsByWindow><Centroid><Location><pos>3.8573717948717934 0.23</pos></Location></Centroid><Width>0.35</Width><Length>0.35</Length></PassengerSpot><PassengerSpot id="seat_1778949544524" version="1.0"><Label>128</Label><Orientation>forwards</Orientation><actualVehicleEquipments /><SpotColumnRef ref="SpotColumn/id/D" version="1.0" /><SpotRowRef ref="SpotRow/id/6" version="1.0" /><Centroid><Location><pos>4.472756410256409 0.585</pos></Location></Centroid><Width>0.35</Width><Length>0.35</Length></PassengerSpot><PassengerSpot id="seat_1778949547180" version="1.0"><Label>127</Label><Orientation>forwards</Orientation><actualVehicleEquipments /><SpotColumnRef ref="spot_column_1778936952743" version="1.0" /><SpotRowRef ref="SpotRow/id/6" version="1.0" /><IsByWindow>true</IsByWindow><Centroid><Location><pos>4.472756410256409 0.23</pos></Location></Centroid><Width>0.35</Width><Length>0.35</Length></PassengerSpot><PassengerSpot id="seat_1778949548557" version="1.0"><Label>137</Label><Orientation>forwards</Orientation><actualVehicleEquipments /><SpotColumnRef ref="SpotColumn/id/A" version="1.0" /><SpotRowRef ref="SpotRow/id/4" version="1.0" /><IsByWindow>true</IsByWindow><Centroid><Location><pos>3.2535256410256403 1.775</pos></Location></Centroid><Width>0.35</Width><Length>0.35</Length></PassengerSpot><PassengerSpot id="seat_1778949550116" version="1.0"><Label>133</Label><Orientation>forwards</Orientation><actualVehicleEquipments /><SpotColumnRef ref="SpotColumn/id/A" version="1.0" /><SpotRowRef ref="SpotRow/id/5" version="1.0" /><IsByWindow>true</IsByWindow><Centroid><Location><pos>3.8573717948717934 1.775</pos></Location></Centroid><Width>0.35</Width><Length>0.35</Length></PassengerSpot><PassengerSpot id="seat_1778949553005" version="1.0"><Label>129</Label><Orientation>forwards</Orientation><actualVehicleEquipments /><SpotColumnRef ref="SpotColumn/id/A" version="1.0" /><SpotRowRef ref="SpotRow/id/6" version="1.0" /><IsByWindow>true</IsByWindow><Centroid><Location><pos>4.472756410256409 1.775</pos></Location></Centroid><Width>0.35</Width><Length>0.35</Length></PassengerSpot><PassengerSpot id="seat_1778949554387" version="1.0"><Label>121</Label><Orientation>backwards</Orientation><actualVehicleEquipments /><SpotColumnRef ref="SpotColumn/id/A" version="1.0" /><SpotRowRef ref="SpotRow/id/9" version="1.0" /><IsByWindow>true</IsByWindow><Centroid><Location><pos>5.84775641025641 1.775</pos></Location></Centroid><Width>0.35</Width><Length>0.35</Length></PassengerSpot><PassengerSpot id="seat_1778949558285" version="1.0"><Label>120</Label><Orientation>backwards</Orientation><actualVehicleEquipments /><SpotColumnRef ref="SpotColumn/id/D" version="1.0" /><SpotRowRef ref="SpotRow/id/9" version="1.0" /><Centroid><Location><pos>5.84775641025641 0.585</pos></Location></Centroid><Width>0.35</Width><Length>0.35</Length></PassengerSpot><PassengerSpot id="seat_1778949559700" version="1.0"><Label>119</Label><Orientation>backwards</Orientation><actualVehicleEquipments /><SpotColumnRef ref="spot_column_1778936952743" version="1.0" /><SpotRowRef ref="SpotRow/id/9" version="1.0" /><IsByWindow>true</IsByWindow><Centroid><Location><pos>5.84775641025641 0.23</pos></Location></Centroid><Width>0.35</Width><Length>0.35</Length></PassengerSpot><PassengerSpot id="seat_1778949561004" version="1.0"><Label>116</Label><Orientation>backwards</Orientation><actualVehicleEquipments /><SpotColumnRef ref="SpotColumn/id/D" version="1.0" /><SpotRowRef ref="SpotRow/id/10" version="1.0" /><Centroid><Location><pos>6.451602564102564 0.585</pos></Location></Centroid><Width>0.35</Width><Length>0.35</Length></PassengerSpot><PassengerSpot id="seat_1778949565540" version="1.0"><Label>115</Label><Orientation>backwards</Orientation><actualVehicleEquipments /><SpotColumnRef ref="spot_column_1778936952743" version="1.0" /><SpotRowRef ref="SpotRow/id/10" version="1.0" /><IsByWindow>true</IsByWindow><Centroid><Location><pos>6.451602564102564 0.23</pos></Location></Centroid><Width>0.35</Width><Length>0.35</Length></PassengerSpot><PassengerSpot id="seat_1778949570101" version="1.0"><Label>117</Label><Orientation>backwards</Orientation><actualVehicleEquipments /><SpotColumnRef ref="SpotColumn/id/A" version="1.0" /><SpotRowRef ref="SpotRow/id/10" version="1.0" /><IsByWindow>true</IsByWindow><Centroid><Location><pos>6.451602564102564 1.775</pos></Location></Centroid><Width>0.35</Width><Length>0.35</Length></PassengerSpot><PassengerSpot id="seat_1778949573539" version="1.0"><Label>113</Label><Orientation>backwards</Orientation><actualVehicleEquipments /><SpotColumnRef ref="SpotColumn/id/A" version="1.0" /><SpotRowRef ref="SpotRow/id/11" version="1.0" /><IsByWindow>true</IsByWindow><Centroid><Location><pos>7.026602564102564 1.775</pos></Location></Centroid><Width>0.35</Width><Length>0.35</Length></PassengerSpot><PassengerSpot id="seat_1778949574772" version="1.0"><Label>109</Label><Orientation>backwards</Orientation><actualVehicleEquipments /><SpotColumnRef ref="SpotColumn/id/A" version="1.0" /><SpotRowRef ref="spot_row_1778936985294" version="1.0" /><IsByWindow>true</IsByWindow><Centroid><Location><pos>7.589102564102564 1.775</pos></Location></Centroid><Width>0.35</Width><Length>0.35</Length></PassengerSpot><PassengerSpot id="seat_1778949578028" version="1.0"><Label>103</Label><Orientation>backwards</Orientation><actualVehicleEquipments /><SpotColumnRef ref="SpotColumn/id/A" version="1.0" /><SpotRowRef ref="spot_row_1778936986382" version="1.0" /><IsByWindow>true</IsByWindow><Centroid><Location><pos>8.208333333333334 1.775</pos></Location></Centroid><Width>0.35</Width><Length>0.35</Length></PassengerSpot><PassengerSpot id="seat_1778949579540" version="1.0"><Label>112</Label><Orientation>backwards</Orientation><actualVehicleEquipments /><SpotColumnRef ref="SpotColumn/id/D" version="1.0" /><SpotRowRef ref="SpotRow/id/11" version="1.0" /><Centroid><Location><pos>7.026602564102564 0.585</pos></Location></Centroid><Width>0.35</Width><Length>0.35</Length></PassengerSpot><PassengerSpot id="seat_1778949580950" version="1.0"><Label>111</Label><Orientation>backwards</Orientation><actualVehicleEquipments /><SpotColumnRef ref="spot_column_1778936952743" version="1.0" /><SpotRowRef ref="SpotRow/id/11" version="1.0" /><IsByWindow>true</IsByWindow><Centroid><Location><pos>7.026602564102564 0.23</pos></Location></Centroid><Width>0.35</Width><Length>0.35</Length></PassengerSpot><PassengerSpot id="seat_1778949582596" version="1.0"><Label>108</Label><Orientation>backwards</Orientation><actualVehicleEquipments /><SpotColumnRef ref="SpotColumn/id/D" version="1.0" /><SpotRowRef ref="spot_row_1778936985294" version="1.0" /><Centroid><Location><pos>7.589102564102564 0.585</pos></Location></Centroid><Width>0.35</Width><Length>0.35</Length></PassengerSpot><PassengerSpot id="seat_1778949584068" version="1.0"><Label>107</Label><Orientation>backwards</Orientation><actualVehicleEquipments /><SpotColumnRef ref="spot_column_1778936952743" version="1.0" /><SpotRowRef ref="spot_row_1778936985294" version="1.0" /><IsByWindow>true</IsByWindow><Centroid><Location><pos>7.589102564102564 0.23</pos></Location></Centroid><Width>0.35</Width><Length>0.35</Length></PassengerSpot><PassengerSpot id="seat_1778949585628" version="1.0"><Label>106</Label><Orientation>backwards</Orientation><actualVehicleEquipments /><SpotColumnRef ref="SpotColumn/id/D" version="1.0" /><SpotRowRef ref="spot_row_1778936986382" version="1.0" /><Centroid><Location><pos>8.208333333333334 0.585</pos></Location></Centroid><Width>0.35</Width><Length>0.35</Length></PassengerSpot><PassengerSpot id="seat_1778949587269" version="1.0"><Label>105</Label><Orientation>backwards</Orientation><actualVehicleEquipments /><SpotColumnRef ref="spot_column_1778936952743" version="1.0" /><SpotRowRef ref="spot_row_1778936986382" version="1.0" /><IsByWindow>true</IsByWindow><Centroid><Location><pos>8.208333333333334 0.23</pos></Location></Centroid><Width>0.35</Width><Length>0.35</Length></PassengerSpot><PassengerSpot id="seat_1778949590102" version="1.0"><Label>101</Label><Orientation>backwards</Orientation><actualVehicleEquipments /><SpotColumnRef ref="spot_column_1778936952743" version="1.0" /><SpotRowRef ref="spot_row_1778936986822" version="1.0" /><IsByWindow>true</IsByWindow><Centroid><Location><pos>8.733333333333336 0.23</pos></Location></Centroid><Width>0.35</Width><Length>0.35</Length></PassengerSpot><PassengerSpot id="seat_1778949593284" version="1.0"><Label>102</Label><Orientation>backwards</Orientation><actualVehicleEquipments /><SpotColumnRef ref="SpotColumn/id/D" version="1.0" /><SpotRowRef ref="spot_row_1778936986822" version="1.0" /><Centroid><Location><pos>8.733333333333336 0.585</pos></Location></Centroid><Width>0.35</Width><Length>0.35</Length></PassengerSpot><PassengerSpot id="seat_1778949647845" version="1.0"><Label>125</Label><Orientation>forwards</Orientation><actualVehicleEquipments /><SpotColumnRef ref="SpotColumn/id/A" version="1.0" /><SpotRowRef ref="SpotRow/id/7" version="1.0" /><IsByWindow>true</IsByWindow><Centroid><Location><pos>5.058333333333334 1.775</pos></Location></Centroid><Width>0.35</Width><Length>0.35</Length></PassengerSpot><PassengerSpot id="seat_1778950383846" version="1.0"><Label>124</Label><Orientation>forwards</Orientation><actualVehicleEquipments /><SpotColumnRef ref="SpotColumn/id/D" version="1.0" /><SpotRowRef ref="SpotRow/id/7" version="1.0" /><Centroid><Location><pos>5.058333333333334 0.585</pos></Location></Centroid><Width>0.35</Width><Length>0.35</Length></PassengerSpot><PassengerSpot id="seat_1778950385629" version="1.0"><Label>123</Label><Orientation>forwards</Orientation><actualVehicleEquipments /><SpotColumnRef ref="spot_column_1778936952743" version="1.0" /><SpotRowRef ref="SpotRow/id/7" version="1.0" /><IsByWindow>true</IsByWindow><Centroid><Location><pos>5.058333333333334 0.23</pos></Location></Centroid><Width>0.35</Width><Length>0.35</Length></PassengerSpot></passengerSpots><luggageSpots /><deckEntrances><PassengerEntrance id="entrance_1778950926855" version="1.0"><actualVehicleEquipments /><Centroid><Location><pos>0.3111111111111111 1.946667</pos></Location></Centroid></PassengerEntrance><PassengerEntrance id="entrance_1778950928595" version="1.0"><actualVehicleEquipments /><Centroid><Location><pos>12.2 1.977778</pos></Location></Centroid></PassengerEntrance><PassengerEntrance id="entrance_1778950938091" version="1.0"><actualVehicleEquipments /><Centroid><Location><pos>0.29111111111111115 0.037778</pos></Location></Centroid></PassengerEntrance><PassengerEntrance id="entrance_1778950940714" version="1.0"><actualVehicleEquipments /><Centroid><Location><pos>12.2 0.022222</pos></Location></Centroid></PassengerEntrance></deckEntrances><deckEntranceUsage /><deckEntranceCouples /><deckSpaceCapacities /><actualVehicleEquipments /><FareClass>Best</FareClass></PassengerSpace><PassengerSpace id="seating-area_1778951084721" version="1.0"><Name>Lounge</Name><PassengerSpaceType>seatingArea</PassengerSpaceType><passengerSpots><PassengerSpot id="seat_1778949594749" version="1.0"><Label>171</Label><Orientation>forwards</Orientation><actualVehicleEquipments /><SpotColumnRef ref="spot_column_1778936952743" version="1.0" /><SpotRowRef ref="spot_row_1778936987173" version="1.0" /><IsByWindow>true</IsByWindow><Centroid><Location><pos>9.183333333333334 0.23</pos></Location></Centroid><Width>0.35</Width><Length>0.35</Length></PassengerSpot><PassengerSpot id="seat_1778949598573" version="1.0"><Label>172</Label><Orientation>forwards</Orientation><actualVehicleEquipments /><SpotColumnRef ref="SpotColumn/id/D" version="1.0" /><SpotRowRef ref="spot_row_1778936987173" version="1.0" /><Centroid><Location><pos>9.183333333333334 0.585</pos></Location></Centroid><Width>0.35</Width><Length>0.35</Length></PassengerSpot><PassengerSpot id="seat_1778949600084" version="1.0"><Label>174</Label><Orientation>forwards</Orientation><actualVehicleEquipments /><SpotColumnRef ref="SpotColumn/id/C" version="1.0" /><SpotRowRef ref="spot_row_1778936987173" version="1.0" /><Centroid><Location><pos>9.183333333333334 0.925</pos></Location></Centroid><Width>0.35</Width><Length>0.35</Length></PassengerSpot><PassengerSpot id="seat_1778949601637" version="1.0"><Label>175</Label><Orientation>leftwards</Orientation><actualVehicleEquipments /><SpotColumnRef ref="spot_column_1778936952743" version="1.0" /><SpotRowRef ref="spot_row_1778936988038" version="1.0" /><Centroid><Location><pos>9.795833333333336 0.23</pos></Location></Centroid><Width>0.35</Width><Length>0.35</Length></PassengerSpot><PassengerSpot id="seat_1778949608438" version="1.0"><Label>176</Label><Orientation>leftwards</Orientation><actualVehicleEquipments /><SpotColumnRef ref="spot_column_1778936952743" version="1.0" /><SpotRowRef ref="spot_row_1778936988454" version="1.0" /><Centroid><Location><pos>10.145833333333336 0.23</pos></Location></Centroid><Width>0.35</Width><Length>0.35</Length></PassengerSpot><PassengerSpot id="seat_1778949609925" version="1.0"><Label>177</Label><Orientation>leftwards</Orientation><actualVehicleEquipments /><SpotColumnRef ref="spot_column_1778936952743" version="1.0" /><SpotRowRef ref="spot_row_1778936988839" version="1.0" /><Centroid><Location><pos>10.570833333333335 0.23</pos></Location></Centroid><Width>0.35</Width><Length>0.35</Length></PassengerSpot><PassengerSpot id="seat_1778949613334" version="1.0"><Label>178</Label><Orientation>leftwards</Orientation><actualVehicleEquipments /><SpotColumnRef ref="spot_column_1778936952743" version="1.0" /><SpotRowRef ref="spot_row_1778936989382" version="1.0" /><Centroid><Location><pos>10.933333333333334 0.23</pos></Location></Centroid><Width>0.35</Width><Length>0.35</Length></PassengerSpot><PassengerSpot id="seat_1778949634064" version="1.0"><Label>179</Label><Orientation>backwards</Orientation><actualVehicleEquipments /><SpotColumnRef ref="spot_column_1778936952743" version="1.0" /><SpotRowRef ref="spot_row_1778949629523" version="1.0" /><IsByWindow>true</IsByWindow><Centroid><Location><pos>11.58 0.23</pos></Location></Centroid><Width>0.35</Width><Length>0.35</Length></PassengerSpot><PassengerSpot id="seat_1778949637141" version="1.0"><Label>180</Label><Orientation>backwards</Orientation><actualVehicleEquipments /><SpotColumnRef ref="SpotColumn/id/D" version="1.0" /><SpotRowRef ref="spot_row_1778949629523" version="1.0" /><Centroid><Location><pos>11.58 0.585</pos></Location></Centroid><Width>0.35</Width><Length>0.35</Length></PassengerSpot><PassengerSpot id="seat_1778949638877" version="1.0"><Label>182</Label><Orientation>backwards</Orientation><actualVehicleEquipments /><SpotColumnRef ref="SpotColumn/id/C" version="1.0" /><SpotRowRef ref="spot_row_1778949629523" version="1.0" /><Centroid><Location><pos>11.58 0.925</pos></Location></Centroid><Width>0.35</Width><Length>0.35</Length></PassengerSpot><PassengerSpot id="seat_1778949640598" version="1.0"><Label>184</Label><Orientation>rightwards</Orientation><actualVehicleEquipments /><SpotColumnRef ref="SpotColumn/id/C" version="1.0" /><SpotRowRef ref="spot_row_1778936988454" version="1.0" /><Centroid><Location><pos>10.703333333333337 0.925</pos></Location></Centroid><Width>0.35</Width><Length>0.35</Length></PassengerSpot><PassengerSpot id="seat_1778949646135" version="1.0"><Label>183</Label><Orientation>rightwards</Orientation><actualVehicleEquipments /><SpotColumnRef ref="SpotColumn/id/C" version="1.0" /><SpotRowRef ref="spot_row_1778936988839" version="1.0" /><Centroid><Location><pos>10.323333333333336 0.925</pos></Location></Centroid><Width>0.35</Width><Length>0.35</Length></PassengerSpot></passengerSpots><luggageSpots /><deckEntrances /><deckEntranceUsage /><deckEntranceCouples /><deckSpaceCapacities /><actualVehicleEquipments /><FareClass>Best</FareClass></PassengerSpace></deckSpaces><DeckLevelRef ref="deck_level_0" version="1.0" /><Name /><Width>2</Width><Length>13</Length></Deck></decks></DeckPlan></deckPlans></ResourceFrame></frames></CompositeFrame></dataObjects></PublicationDelivery>`)[0]?.decks??[],isGhost:!0}}var kn=e((()=>{ae()}));function An(e,t){let[n,r]=(0,B.useState)([]),[i,a]=(0,B.useState)(!1),[o,s]=(0,B.useState)(!1),[c,l]=(0,B.useState)(null);return(0,B.useEffect)(()=>{if(!e){r([]),a(!1),s(!1),l(null);return}let n=!1;return s(!0),l(null),re().then(i=>{if(n)return;let o=On(i,e,t);r(o.decks),a(o.isGhost)}).catch(e=>{n||(r([]),a(!1),l(e instanceof Error?e.message:String(e)))}).finally(()=>{n||s(!1)}),()=>{n=!0}},[e,t]),{decks:n,isGhost:i,loading:o,error:c}}var B,jn=e((()=>{B=t(s(),1),se(),kn()}));function Mn({value:e,onChange:t,mode:r,isCreate:o,xml:s,loading:c,fetchError:u,onRetry:f}){let{t:p}=m(),[g,_]=(0,Fn.useState)(`edit`),ee=r===`view`,re=n=>t({...e,...n}),v=(0,V.jsxs)(te,{"data-testid":`deck-plan-tab-edit`,children:[(0,V.jsx)(ne,{id:`deckPlan-name`,label:p(`deckPlans.field.name`,`Name`),children:(0,V.jsx)(d,{id:`deckPlan-name`,value:e.name?.value??``,onChange:t=>re({name:En(e.name,t.target.value)}),disabled:ee,size:`small`,fullWidth:!0})}),(0,V.jsx)(ne,{id:`deckPlan-description`,label:p(`deckPlans.field.description`,`Description`),children:(0,V.jsx)(d,{id:`deckPlan-description`,value:e.description?.value??``,onChange:t=>re({description:En(e.description,t.target.value)}),disabled:ee,size:`small`,fullWidth:!0})})]});return o?(0,V.jsx)(i,{children:v}):(0,V.jsxs)(i,{children:[(0,V.jsxs)(a,{value:g,onChange:(e,t)=>_(t),sx:In,children:[(0,V.jsx)(l,{value:`edit`,label:p(`deckPlans.tab.edit`,`Edit`)}),(0,V.jsx)(l,{value:`xml`,label:p(`deckPlans.tab.xml`,`XML`)})]}),g===`edit`&&(0,V.jsxs)(i,{children:[v,(0,V.jsx)(n,{sx:{my:1.5}}),(0,V.jsx)(Nn,{loading:c,fetchError:u,onRetry:f,testIdPrefix:`deck-plan-decks`,children:(0,V.jsx)(Pn,{xml:s,id:e.id||void 0})})]}),g===`xml`&&(0,V.jsx)(i,{"data-testid":`deck-plan-tab-xml`,children:(0,V.jsx)(Nn,{loading:c,fetchError:u,onRetry:f,testIdPrefix:`deck-plan-xml`,children:(0,V.jsx)(h,{"aria-label":`deck plan data`,"data-testid":`deck-plan-xml-textarea`,readOnly:!0,value:s,minRows:10,style:Ln})})})]})}function Nn({loading:e,fetchError:t,onRetry:n,testIdPrefix:a,children:o}){let{t:s}=m();return e?(0,V.jsx)(i,{sx:{display:`flex`,justifyContent:`center`,py:4},children:(0,V.jsx)(r,{"data-testid":`${a}-loading`})}):t?(0,V.jsxs)(c,{spacing:1,children:[(0,V.jsx)(p,{severity:`error`,"data-testid":`${a}-fetch-error`,children:t}),(0,V.jsx)(i,{children:(0,V.jsx)(_,{onClick:n,size:`small`,variant:`outlined`,children:s(`common.retry`,`Retry`)})})]}):o}function Pn({xml:e,id:t}){let{t:n}=m(),{decks:a,isGhost:s,loading:l,error:u}=An(e,t);return l?(0,V.jsx)(i,{sx:{display:`flex`,justifyContent:`center`,py:4},children:(0,V.jsx)(r,{"data-testid":`deck-plan-decks-rendering`})}):u?(0,V.jsxs)(p,{severity:`error`,"data-testid":`deck-plan-decks-error`,children:[n(`deckPlans.render.error`,`Could not render the deck plan`),`: `,u]}):a.length===0?null:(0,V.jsxs)(c,{spacing:1,"data-testid":`deck-plan-decks`,children:[s&&(0,V.jsxs)(i,{"data-testid":`deck-plan-decks-sample`,children:[(0,V.jsx)(o,{variant:`subtitle2`,children:n(`deckPlans.deck.sample`,`SAMPLE`)}),(0,V.jsx)(o,{variant:`caption`,color:`text.secondary`,children:n(`deckPlans.deck.sampleHint`,`This plan has no decks yet — showing a sample layout.`)})]}),(0,V.jsx)(c,{direction:`row`,spacing:2,sx:{overflowX:`auto`,pb:1},children:a.map((e,t)=>(0,V.jsxs)(c,{spacing:.5,alignItems:`center`,sx:{flex:`0 0 auto`},children:[(0,V.jsx)(oe,{deck:e,vertical:!0,"data-testid":`deck-plan-deck-${t}`}),(0,V.jsx)(o,{variant:`caption`,color:`text.secondary`,noWrap:!0,children:e.Name||n(`deckPlans.deck.label`,`Deck {{n}}`,{n:t+1})})]},e.attr_id||t))})]})}var Fn,V,In,Ln,Rn=e((()=>{Fn=t(s(),1),f(),g(),ee(),Dn(),jn(),v(),V=u(),In={mb:1.5,minHeight:0,"& .MuiTabs-indicator":{display:`none`},"& .MuiTabs-flexContainer":{flexWrap:`wrap`,gap:.75},"& .MuiTab-root":{minHeight:30,px:1.25,py:.25,borderRadius:1,textTransform:`none`,bgcolor:`action.hover`,color:`text.secondary`},"& .MuiTab-root.Mui-selected":{bgcolor:`primary.main`,color:`primary.contrastText`}},Ln={width:`100%`,padding:`8px`,borderRadius:`4px`,borderColor:`rgba(0, 0, 0, 0.23)`,borderWidth:`1px`,borderStyle:`solid`,fontSize:`14px`,fontFamily:`monospace`,boxSizing:`border-box`},Mn.__docgenInfo={description:`Reusable, presentational DeckPlan editor — a tabbed FormLayout driven by
\`value\`/\`onChange\`/\`mode\`, mirroring the VehicleType editor's shape. Tabs:
Edit (name + description, then a horizontal strip of read-only deck
renderings) · XML (the read-only NeTEx source). Both panes render from the
same fetched body and so share its loading and fetch-error states.

The XML body is never editable — name and description are patched into the
fetched document on save instead.

Holds no fetch/save logic; chrome (title, EditorRail, snackbars, dirty
tracking) lives in \`DeckPlanDetails\`.`,methods:[],displayName:`DeckPlanForm`,props:{value:{required:!0,tsType:{name:`signature`,type:`object`,raw:`{
  id: string;
  version?: number;
  name?: Name;
  description?: Name;
}`,signature:{properties:[{key:`id`,value:{name:`string`,required:!0}},{key:`version`,value:{name:`number`,required:!1}},{key:`name`,value:{name:`signature`,type:`object`,raw:`{
  value: string;
  lang?: string;
}`,signature:{properties:[{key:`value`,value:{name:`string`,required:!0}},{key:`lang`,value:{name:`string`,required:!1}}]},required:!1}},{key:`description`,value:{name:`signature`,type:`object`,raw:`{
  value: string;
  lang?: string;
}`,signature:{properties:[{key:`value`,value:{name:`string`,required:!0}},{key:`lang`,value:{name:`string`,required:!1}}]},required:!1}}]}},description:`Current deck plan — the editable name/description fields.`},onChange:{required:!0,tsType:{name:`signature`,type:`function`,raw:`(next: DeckPlan) => void`,signature:{arguments:[{type:{name:`signature`,type:`object`,raw:`{
  id: string;
  version?: number;
  name?: Name;
  description?: Name;
}`,signature:{properties:[{key:`id`,value:{name:`string`,required:!0}},{key:`version`,value:{name:`number`,required:!1}},{key:`name`,value:{name:`signature`,type:`object`,raw:`{
  value: string;
  lang?: string;
}`,signature:{properties:[{key:`value`,value:{name:`string`,required:!0}},{key:`lang`,value:{name:`string`,required:!1}}]},required:!1}},{key:`description`,value:{name:`signature`,type:`object`,raw:`{
  value: string;
  lang?: string;
}`,signature:{properties:[{key:`value`,value:{name:`string`,required:!0}},{key:`lang`,value:{name:`string`,required:!1}}]},required:!1}}]}},name:`next`}],return:{name:`void`}}},description:`Fired with the merged next value on every field edit.`},mode:{required:!0,tsType:{name:`union`,raw:`'view' | 'edit'`,elements:[{name:`literal`,value:`'view'`},{name:`literal`,value:`'edit'`}]},description:"`'view'` disables the inputs; `'edit'` enables them."},isCreate:{required:!0,tsType:{name:`boolean`},description:`Create flow — hides the tab strip; there is no persisted body yet.`},xml:{required:!0,tsType:{name:`string`},description:`NeTEx XML body, read-only.`},loading:{required:!0,tsType:{name:`boolean`},description:`Body fetch in flight; renders a spinner in both tabs' body panes.`},fetchError:{required:!0,tsType:{name:`union`,raw:`string | null`,elements:[{name:`string`},{name:`null`}]},description:`Body fetch error; renders an alert + retry in both tabs' body panes.`},onRetry:{required:!0,tsType:{name:`signature`,type:`function`,raw:`() => void`,signature:{arguments:[],return:{name:`void`}}},description:`Refetch trigger from the parent hook.`}}}}));function zn(e){let t=e.PublicationDelivery?.dataObjects;return t?.CompositeFrame?.frames?.ResourceFrame??t?.ResourceFrame}function Bn(e){return e==null?[]:Array.isArray(e)?e:[e]}var Vn,Hn=e((()=>{Tn(),Vn=new $t({ignoreAttributes:!1}),new $t({ignoreAttributes:!1,parseTagValue:!1})})),Un,Wn=e((()=>{Un=`<?xml version="1.0" encoding="utf-8"?>
<PublicationDelivery version="1.2.2" schemaLocation="http://www.netex.org.uk/netex file:///home/robin/Projekte/NeTEx/xsd/NeTEx_publication.xsd">
  <PublicationTimestamp>2020-12-17T09:30:47.0Z</PublicationTimestamp>
  <ParticipantRef>SYS001</ParticipantRef>
  <dataObjects>
    <CompositeFrame version="any" id="CompositeFrame/id/1">
      <frames>
        <ResourceFrame version="any" id="ResourceFrame/id/1">
          <equipments>
            <AccessVehicleEquipment id="AccessVehicleEquipment/id/1" version="any">
              <Name>Ramp</Name>
              <Fixed>false</Fixed>
              <LowFloor>false</LowFloor>
              <HighFloor>false</HighFloor>
              <Ramp>true</Ramp>
            </AccessVehicleEquipment>
            <AccessVehicleEquipment id="AccessVehicleEquipment/id/2" version="any">
              <Name>Lift</Name>
              <Fixed>false</Fixed>
              <LowFloor>false</LowFloor>
              <HighFloor>false</HighFloor>
              <Ramp>false</Ramp>
            </AccessVehicleEquipment>
            <AccessVehicleEquipment id="AccessVehicleEquipment/id/3" version="any">
              <Name>Entrance dimensions</Name>
              <Fixed>false</Fixed>
              <LowFloor>false</LowFloor>
              <HighFloor>false</HighFloor>
              <Ramp>false</Ramp>
            </AccessVehicleEquipment>
          </equipments>
          <serviceFacilitySets>
            <ServiceFacilitySet version="any" id="ServiceFacilityTrain">
              <PassengerInformationFacilityList>nextStopIndicator

                stopAnnouncements</PassengerInformationFacilityList>
              <SanitaryFacilityList>toilet
                wheelchairAccessToilet</SanitaryFacilityList>
              <TicketingFacilityList />
            </ServiceFacilitySet>
            <ServiceFacilitySet version="any" id="ServiceFacilityQuiet">
              <NuisanceFacilityList>mobilePhoneFreeZone</NuisanceFacilityList>
            </ServiceFacilitySet>
          </serviceFacilitySets>
          <vehicleTypes>
            <Train version="any" id="Train/id/1">
              <privateCodes>
                <PrivateCode type="Fahrzeug-Ident-Nr.">
                  94808442201
                </PrivateCode>
              </privateCodes>
              <Name>Talent 3</Name>
              <Description>4 Teiler</Description>
              <ReversingDirection>true</ReversingDirection>
              <SelfPropelled>true</SelfPropelled>
              <PropulsionType>electric</PropulsionType>
              <TransportMode>rail</TransportMode>
              <capacities>
                <PassengerCapacity version="any" id="PassengerCapacity/id/1">
                  <FareClass>firstClass</FareClass>
                  <SeatingCapacity>8</SeatingCapacity>
                </PassengerCapacity>
                <PassengerCapacity version="any" id="PassengerCapacity/id/2">
                  <FareClass>secondClass</FareClass>
                  <SeatingCapacity>207</SeatingCapacity>
                  <StandingCapacity>275</StandingCapacity>
                  <WheelchairPlaceCapacity>2</WheelchairPlaceCapacity>
                  <BicycleRackCapacity>33</BicycleRackCapacity>
                </PassengerCapacity>
              </capacities>
              <LowFloor>false</LowFloor>
              <HasLiftOrRamp>true</HasLiftOrRamp>
              <BoardingHeight>0.6</BoardingHeight>
              <Length>72.3</Length>
              <Width>2.926</Width>
              <Height>4.26</Height>
              <facilities>
                <ServiceFacilitySetRef version="any" ref="ServiceFacilityTrain" />
              </facilities>
              <components>
                <TrainComponent version="any" id="TrainComponent/id/1">
                  <Label>201-3</Label>
                  <TractiveElementTypeRef version="any" ref="TractiveElementType/id/T3-1" />
                  <OperationalOrientation>forwards</OperationalOrientation>
                  <ForwardCoupling>
                    <Splittable>true</Splittable>
                    <ThroughAccess>noThroughAccess</ThroughAccess>
                  </ForwardCoupling>
                </TrainComponent>
                <TrainComponent version="any" id="TrainComponent/id/2">
                  <Label>201-8</Label>
                  <TrailingElementTypeRef version="any" ref="TrailingElementType/id/M3-1" />
                  <OperationalOrientation>forwards</OperationalOrientation>
                  <ForwardCoupling>
                    <Splittable>true</Splittable>
                    <ThroughAccess>openEntrance</ThroughAccess>
                  </ForwardCoupling>
                </TrainComponent>
                <TrainComponent version="any" id="TrainComponent/id/3">
                  <Label>701-7</Label>
                  <TrailingElementTypeRef version="any" ref="TrailingElementType/id/M2-1" />
                  <OperationalOrientation>forwards</OperationalOrientation>
                  <ForwardCoupling>
                    <Splittable>true</Splittable>
                    <ThroughAccess>openEntrance</ThroughAccess>
                  </ForwardCoupling>
                </TrainComponent>
                <TrainComponent version="any" id="TrainComponent/id/4">
                  <Label>701-9</Label>
                  <TractiveElementTypeRef version="any" ref="TractiveElementType/id/T2-1" />
                  <OperationalOrientation>forwards</OperationalOrientation>
                  <ForwardCoupling>
                    <Splittable>true</Splittable>
                    <ThroughAccess>openEntrance</ThroughAccess>
                  </ForwardCoupling>
                </TrainComponent>
              </components>
            </Train>
          </vehicleTypes>
          <trainElementTypes>
            <TractiveElementType version="any" id="TractiveElementType/id/T3-1">
              <Name>T3-1</Name>
              <TrainElementType>engine</TrainElementType>
              <Length>20.05</Length>
              <Width>2.926</Width>
              <Height>4.26</Height>
              <DeckPlanRef version="any" ref="DeckPlan/id/1" />
            </TractiveElementType>
            <TractiveElementType version="any" id="TractiveElementType/id/T2-1">
              <Name>T2-1</Name>
              <TrainElementType>engine</TrainElementType>
              <Length>20.05</Length>
              <Width>2.926</Width>
              <Height>4.26</Height>
            </TractiveElementType>
            <TrailingElementType version="any" id="TrailingElementType/id/M3-1">
              <Name>M3-1</Name>
              <TrainElementType>carriage</TrainElementType>
              <Length>16.1</Length>
              <Width>2.926</Width>
              <Height>4.26</Height>
            </TrailingElementType>
            <TrailingElementType version="any" id="TrailingElementType/id/M2-1">
              <Name>M2-1</Name>
              <TrainElementType>carriage</TrainElementType>
              <Length>16.1</Length>
              <Width>2.926</Width>
              <Height>4.26</Height>
            </TrailingElementType>
          </trainElementTypes>
          <deckPlans>
            <DeckPlan id="DeckPlan/id/1" version="any">
              <xmlTagName />
              <decks>
                <Deck id="Deck/id/1" version="any">
                  <spotRows>
                    <SpotRow id="SpotRow/id/1" />
                    <SpotRow id="SpotRow/id/2" />
                    <SpotRow id="SpotRow/id/3" />
                    <SpotRow id="SpotRow/id/4" />
                    <SpotRow id="SpotRow/id/5" />
                    <SpotRow id="SpotRow/id/6" />
                    <SpotRow id="SpotRow/id/7" />
                    <SpotRow id="SpotRow/id/8" />
                    <SpotRow id="SpotRow/id/9" />
                    <SpotRow id="SpotRow/id/10" />
                    <SpotRow id="SpotRow/id/11" />
                    <SpotRow id="spot_row_1778936985294" />
                    <SpotRow id="spot_row_1778936986382" />
                    <SpotRow id="spot_row_1778936986822" />
                    <SpotRow id="spot_row_1778936987173" />
                    <SpotRow id="spot_row_1778936987614" />
                    <SpotRow id="spot_row_1778936988038" />
                    <SpotRow id="spot_row_1778936988454" />
                    <SpotRow id="spot_row_1778936988839" />
                    <SpotRow id="spot_row_1778936989382" />
                  </spotRows>
                  <spotColumns>
                    <SpotColumn id="SpotColumn/id/A" />
                    <SpotColumn id="SpotColumn/id/B" />
                    <SpotColumn id="SpotColumn/id/C" />
                    <SpotColumn id="SpotColumn/id/D" />
                    <SpotColumn id="spot_column_1778936952743" />
                  </spotColumns>
                  <deckSpaces>
                    <PassengerSpace id="seating-area_1779021502009" version="1.0">
                      <Name>Area 1</Name>
                      <PassengerSpaceType>seatingArea</PassengerSpaceType>
                      <passengerSpots>
                        <PassengerSpot id="seat_1778937092812" version="1.0">
                          <Label>77</Label>
                          <Orientation>backwards</Orientation>
                          <actualVehicleEquipments />
                          <SpotColumnRef ref="spot_column_1778936952743" version="1.0" />
                          <SpotRowRef ref="SpotRow/id/5" version="1.0" />
                          <IsByWindow>true</IsByWindow>
                          <Centroid>
                            <Location>
                              <pos>3.3902046783625726 0.206842</pos>
                            </Location>
                          </Centroid>
                          <Width>0.35</Width>
                          <Length>0.35</Length>
                        </PassengerSpot>
                        <PassengerSpot id="seat_1778937062102" version="1.0">
                          <Label>79</Label>
                          <Orientation>forwards</Orientation>
                          <actualVehicleEquipments />
                          <SpotColumnRef ref="SpotColumn/id/A" version="1.0" />
                          <SpotRowRef ref="SpotRow/id/5" version="1.0" />
                          <IsByWindow>true</IsByWindow>
                          <Centroid>
                            <Location>
                              <pos>3.390204678362572 1.766429</pos>
                            </Location>
                          </Centroid>
                          <Width>0.35</Width>
                          <Length>0.35</Length>
                        </PassengerSpot>
                        <PassengerSpot id="seat_1778937064374" version="1.0">
                          <Label>75</Label>
                          <Orientation>forwards</Orientation>
                          <actualVehicleEquipments />
                          <SpotColumnRef ref="SpotColumn/id/A" version="1.0" />
                          <SpotRowRef ref="SpotRow/id/4" version="1.0" />
                          <IsByWindow>true</IsByWindow>
                          <Centroid>
                            <Location>
                              <pos>2.705994152046783 1.766429</pos>
                            </Location>
                          </Centroid>
                          <Width>0.35</Width>
                          <Length>0.35</Length>
                        </PassengerSpot>
                        <PassengerSpot id="seat_1778937065965" version="1.0">
                          <Label>71</Label>
                          <Orientation>forwards</Orientation>
                          <actualVehicleEquipments />
                          <SpotColumnRef ref="SpotColumn/id/A" version="1.0" />
                          <SpotRowRef ref="SpotRow/id/3" version="1.0" />
                          <IsByWindow>true</IsByWindow>
                          <Centroid>
                            <Location>
                              <pos>2.148099415204678 1.766429</pos>
                            </Location>
                          </Centroid>
                          <Width>0.35</Width>
                          <Length>0.35</Length>
                        </PassengerSpot>
                        <PassengerSpot id="seat_1778937067645" version="1.0">
                          <Label>67</Label>
                          <Orientation>forwards</Orientation>
                          <actualVehicleEquipments />
                          <SpotColumnRef ref="SpotColumn/id/A" version="1.0" />
                          <SpotRowRef ref="SpotRow/id/2" version="1.0" />
                          <IsByWindow>true</IsByWindow>
                          <Centroid>
                            <Location>
                              <pos>1.5178571428571428 1.766429</pos>
                            </Location>
                          </Centroid>
                          <Width>0.35</Width>
                          <Length>0.35</Length>
                        </PassengerSpot>
                        <PassengerSpot id="seat_1778937069070" version="1.0">
                          <Label>63</Label>
                          <Orientation>forwards</Orientation>
                          <actualVehicleEquipments />
                          <SpotColumnRef ref="SpotColumn/id/A" version="1.0" />
                          <SpotRowRef ref="SpotRow/id/1" version="1.0" />
                          <IsByWindow>true</IsByWindow>
                          <Centroid>
                            <Location>
                              <pos>0.8321428571428571 1.766429</pos>
                            </Location>
                          </Centroid>
                          <Width>0.35</Width>
                          <Length>0.35</Length>
                        </PassengerSpot>
                        <PassengerSpot id="seat_1778937070502" version="1.0">
                          <Label>64</Label>
                          <Orientation>forwards</Orientation>
                          <actualVehicleEquipments />
                          <SpotColumnRef ref="SpotColumn/id/B" version="1.0" />
                          <SpotRowRef ref="SpotRow/id/1" version="1.0" />
                          <Centroid>
                            <Location>
                              <pos>0.8321428571428571 1.410714</pos>
                            </Location>
                          </Centroid>
                          <Width>0.35</Width>
                          <Length>0.35</Length>
                        </PassengerSpot>
                        <PassengerSpot id="seat_1778937071949" version="1.0">
                          <Label>68</Label>
                          <Orientation>forwards</Orientation>
                          <actualVehicleEquipments />
                          <SpotColumnRef ref="SpotColumn/id/B" version="1.0" />
                          <SpotRowRef ref="SpotRow/id/2" version="1.0" />
                          <Centroid>
                            <Location>
                              <pos>1.5178571428571428 1.410714</pos>
                            </Location>
                          </Centroid>
                          <Width>0.35</Width>
                          <Length>0.35</Length>
                        </PassengerSpot>
                        <PassengerSpot id="seat_1778937073261" version="1.0">
                          <Label>72</Label>
                          <Orientation>forwards</Orientation>
                          <actualVehicleEquipments />
                          <SpotColumnRef ref="SpotColumn/id/B" version="1.0" />
                          <SpotRowRef ref="SpotRow/id/3" version="1.0" />
                          <Centroid>
                            <Location>
                              <pos>2.148099415204678 1.410714</pos>
                            </Location>
                          </Centroid>
                          <Width>0.35</Width>
                          <Length>0.35</Length>
                        </PassengerSpot>
                        <PassengerSpot id="seat_1778937074877" version="1.0">
                          <Label>76</Label>
                          <Orientation>forwards</Orientation>
                          <actualVehicleEquipments />
                          <SpotColumnRef ref="SpotColumn/id/B" version="1.0" />
                          <SpotRowRef ref="SpotRow/id/4" version="1.0" />
                          <Centroid>
                            <Location>
                              <pos>2.705994152046783 1.410714</pos>
                            </Location>
                          </Centroid>
                          <Width>0.35</Width>
                          <Length>0.35</Length>
                        </PassengerSpot>
                        <PassengerSpot id="seat_1778937076238" version="1.0">
                          <Label>80</Label>
                          <Orientation>forwards</Orientation>
                          <actualVehicleEquipments />
                          <SpotColumnRef ref="SpotColumn/id/B" version="1.0" />
                          <SpotRowRef ref="SpotRow/id/5" version="1.0" />
                          <Centroid>
                            <Location>
                              <pos>3.3902046783625726 1.410714</pos>
                            </Location>
                          </Centroid>
                          <Width>0.35</Width>
                          <Length>0.35</Length>
                        </PassengerSpot>
                        <PassengerSpot id="seat_1778937079148" version="1.0">
                          <Label>62</Label>
                          <Orientation>forwards</Orientation>
                          <actualVehicleEquipments />
                          <SpotColumnRef ref="SpotColumn/id/D" version="1.0" />
                          <SpotRowRef ref="SpotRow/id/1" version="1.0" />
                          <Centroid>
                            <Location>
                              <pos>0.8321428571428571 0.576316</pos>
                            </Location>
                          </Centroid>
                          <Width>0.35</Width>
                          <Length>0.35</Length>
                        </PassengerSpot>
                        <PassengerSpot id="seat_1778937080613" version="1.0">
                          <Label>61</Label>
                          <Orientation>forwards</Orientation>
                          <actualVehicleEquipments />
                          <SpotColumnRef ref="spot_column_1778936952743" version="1.0" />
                          <SpotRowRef ref="SpotRow/id/1" version="1.0" />
                          <IsByWindow>true</IsByWindow>
                          <Centroid>
                            <Location>
                              <pos>0.8321428571428571 0.206842</pos>
                            </Location>
                          </Centroid>
                          <Width>0.35</Width>
                          <Length>0.35</Length>
                        </PassengerSpot>
                        <PassengerSpot id="seat_1778937082092" version="1.0">
                          <Label>66</Label>
                          <Orientation>backwards</Orientation>
                          <actualVehicleEquipments />
                          <SpotColumnRef ref="SpotColumn/id/D" version="1.0" />
                          <SpotRowRef ref="SpotRow/id/2" version="1.0" />
                          <Centroid>
                            <Location>
                              <pos>1.5178571428571428 0.576316</pos>
                            </Location>
                          </Centroid>
                          <Width>0.35</Width>
                          <Length>0.35</Length>
                        </PassengerSpot>
                        <PassengerSpot id="seat_1778937083501" version="1.0">
                          <Label>65</Label>
                          <Orientation>backwards</Orientation>
                          <actualVehicleEquipments />
                          <SpotColumnRef ref="spot_column_1778936952743" version="1.0" />
                          <SpotRowRef ref="SpotRow/id/2" version="1.0" />
                          <IsByWindow>true</IsByWindow>
                          <Centroid>
                            <Location>
                              <pos>1.5178571428571428 0.206842</pos>
                            </Location>
                          </Centroid>
                          <Width>0.35</Width>
                          <Length>0.35</Length>
                        </PassengerSpot>
                        <PassengerSpot id="seat_1778937084957" version="1.0">
                          <Label>70</Label>
                          <Orientation>backwards</Orientation>
                          <actualVehicleEquipments />
                          <SpotColumnRef ref="SpotColumn/id/D" version="1.0" />
                          <SpotRowRef ref="SpotRow/id/3" version="1.0" />
                          <IsByAisle>true</IsByAisle>
                          <Centroid>
                            <Location>
                              <pos>2.148099415204678 0.576316</pos>
                            </Location>
                          </Centroid>
                          <Width>0.35</Width>
                          <Length>0.35</Length>
                        </PassengerSpot>
                        <PassengerSpot id="seat_1778937086445" version="1.0">
                          <Label>69</Label>
                          <Orientation>backwards</Orientation>
                          <actualVehicleEquipments />
                          <SpotColumnRef ref="spot_column_1778936952743" version="1.0" />
                          <SpotRowRef ref="SpotRow/id/3" version="1.0" />
                          <IsByWindow>true</IsByWindow>
                          <Centroid>
                            <Location>
                              <pos>2.148099415204678 0.206842</pos>
                            </Location>
                          </Centroid>
                          <Width>0.35</Width>
                          <Length>0.35</Length>
                        </PassengerSpot>
                        <PassengerSpot id="seat_1778937088101" version="1.0">
                          <Label>74</Label>
                          <Orientation>backwards</Orientation>
                          <actualVehicleEquipments />
                          <SpotColumnRef ref="SpotColumn/id/D" version="1.0" />
                          <SpotRowRef ref="SpotRow/id/4" version="1.0" />
                          <IsByAisle>true</IsByAisle>
                          <Centroid>
                            <Location>
                              <pos>2.705994152046783 0.576316</pos>
                            </Location>
                          </Centroid>
                          <Width>0.35</Width>
                          <Length>0.35</Length>
                        </PassengerSpot>
                        <PassengerSpot id="seat_1778937089669" version="1.0">
                          <Label>73</Label>
                          <Orientation>backwards</Orientation>
                          <actualVehicleEquipments />
                          <SpotColumnRef ref="spot_column_1778936952743" version="1.0" />
                          <SpotRowRef ref="SpotRow/id/4" version="1.0" />
                          <IsByWindow>true</IsByWindow>
                          <Centroid>
                            <Location>
                              <pos>2.705994152046783 0.206842</pos>
                            </Location>
                          </Centroid>
                          <Width>0.35</Width>
                          <Length>0.35</Length>
                        </PassengerSpot>
                        <PassengerSpot id="seat_1778937091213" version="1.0">
                          <Label>78</Label>
                          <Orientation>backwards</Orientation>
                          <actualVehicleEquipments />
                          <SpotColumnRef ref="SpotColumn/id/D" version="1.0" />
                          <SpotRowRef ref="SpotRow/id/5" version="1.0" />
                          <IsByAisle>true</IsByAisle>
                          <Centroid>
                            <Location>
                              <pos>3.3902046783625726 0.576316</pos>
                            </Location>
                          </Centroid>
                          <Width>0.35</Width>
                          <Length>0.35</Length>
                        </PassengerSpot>
                      </passengerSpots>
                      <luggageSpots />
                      <deckEntrances />
                      <deckEntranceUsage />
                      <deckEntranceCouples />
                      <deckSpaceCapacities />
                      <actualVehicleEquipments />
                      <PublicUse>true</PublicUse>
                      <TotalCapacity>0</TotalCapacity>
                      <FareClass>Standard</FareClass>
                      <AirConditioned>true</AirConditioned>
                    </PassengerSpace>
                    <PassengerSpace id="PassengerSpace/id/Main1" version="any">
                      <Name>Area 2</Name>
                      <PassengerSpaceType>seatingArea</PassengerSpaceType>
                      <passengerSpots>
                        <PassengerSpot id="seat_1778936959455" version="1.0">
                          <Label>1</Label>
                          <Orientation>backwards</Orientation>
                          <actualVehicleEquipments />
                          <SpotColumnRef ref="SpotColumn/id/A" version="1.0" />
                          <SpotRowRef ref="spot_row_1778936989382" version="1.0" />
                          <IsByWindow>true</IsByWindow>
                          <Centroid>
                            <Location>
                              <pos>11.99318181818182 1.766429</pos>
                            </Location>
                          </Centroid>
                          <Width>0.35</Width>
                          <Length>0.35</Length>
                        </PassengerSpot>
                        <PassengerSpot id="seat_1778937008159" version="1.0">
                          <Label>2</Label>
                          <Orientation>backwards</Orientation>
                          <actualVehicleEquipments />
                          <SpotColumnRef ref="SpotColumn/id/B" version="1.0" />
                          <SpotRowRef ref="spot_row_1778936989382" version="1.0" />
                          <Centroid>
                            <Location>
                              <pos>11.99318181818182 1.410714</pos>
                            </Location>
                          </Centroid>
                          <Width>0.35</Width>
                          <Length>0.35</Length>
                        </PassengerSpot>
                        <PassengerSpot id="seat_1778937015960" version="1.0">
                          <Label>5</Label>
                          <Orientation>forwards</Orientation>
                          <actualVehicleEquipments />
                          <SpotColumnRef ref="SpotColumn/id/A" version="1.0" />
                          <SpotRowRef ref="spot_row_1778936988839" version="1.0" />
                          <IsByWindow>true</IsByWindow>
                          <Centroid>
                            <Location>
                              <pos>11.39317460317461 1.766429</pos>
                            </Location>
                          </Centroid>
                          <Width>0.35</Width>
                          <Length>0.35</Length>
                        </PassengerSpot>
                        <PassengerSpot id="seat_1778937021040" version="1.0">
                          <Label>6</Label>
                          <Orientation>forwards</Orientation>
                          <actualVehicleEquipments />
                          <SpotColumnRef ref="SpotColumn/id/B" version="1.0" />
                          <SpotRowRef ref="spot_row_1778936988839" version="1.0" />
                          <Centroid>
                            <Location>
                              <pos>11.39317460317461 1.410714</pos>
                            </Location>
                          </Centroid>
                          <Width>0.35</Width>
                          <Length>0.35</Length>
                        </PassengerSpot>
                        <PassengerSpot id="seat_1778937022543" version="1.0">
                          <Label>9</Label>
                          <Orientation>forwards</Orientation>
                          <actualVehicleEquipments />
                          <SpotColumnRef ref="SpotColumn/id/A" version="1.0" />
                          <SpotRowRef ref="spot_row_1778936988454" version="1.0" />
                          <IsByWindow>true</IsByWindow>
                          <Centroid>
                            <Location>
                              <pos>10.790467836257315 1.766429</pos>
                            </Location>
                          </Centroid>
                          <Width>0.35</Width>
                          <Length>0.35</Length>
                        </PassengerSpot>
                        <PassengerSpot id="seat_1778937023767" version="1.0">
                          <Label>10</Label>
                          <Orientation>forwards</Orientation>
                          <actualVehicleEquipments />
                          <SpotColumnRef ref="SpotColumn/id/B" version="1.0" />
                          <SpotRowRef ref="spot_row_1778936988454" version="1.0" />
                          <Centroid>
                            <Location>
                              <pos>10.790467836257315 1.410714</pos>
                            </Location>
                          </Centroid>
                          <Width>0.35</Width>
                          <Length>0.35</Length>
                        </PassengerSpot>
                        <PassengerSpot id="seat_1778937025176" version="1.0">
                          <Label>13</Label>
                          <Orientation>forwards</Orientation>
                          <actualVehicleEquipments />
                          <SpotColumnRef ref="SpotColumn/id/A" version="1.0" />
                          <SpotRowRef ref="spot_row_1778936988038" version="1.0" />
                          <IsByWindow>true</IsByWindow>
                          <Centroid>
                            <Location>
                              <pos>10.216783625730999 1.766429</pos>
                            </Location>
                          </Centroid>
                          <Width>0.35</Width>
                          <Length>0.35</Length>
                        </PassengerSpot>
                        <PassengerSpot id="seat_1778937026727" version="1.0">
                          <Label>14</Label>
                          <Orientation>forwards</Orientation>
                          <actualVehicleEquipments />
                          <SpotColumnRef ref="SpotColumn/id/B" version="1.0" />
                          <SpotRowRef ref="spot_row_1778936988038" version="1.0" />
                          <Centroid>
                            <Location>
                              <pos>10.216783625730999 1.410714</pos>
                            </Location>
                          </Centroid>
                          <Width>0.35</Width>
                          <Length>0.35</Length>
                        </PassengerSpot>
                        <PassengerSpot id="seat_1778937028246" version="1.0">
                          <Label>17</Label>
                          <Orientation>forwards</Orientation>
                          <actualVehicleEquipments />
                          <SpotColumnRef ref="SpotColumn/id/A" version="1.0" />
                          <SpotRowRef ref="spot_row_1778936987614" version="1.0" />
                          <IsByWindow>true</IsByWindow>
                          <Centroid>
                            <Location>
                              <pos>9.679678362573105 1.766429</pos>
                            </Location>
                          </Centroid>
                          <Width>0.35</Width>
                          <Length>0.35</Length>
                        </PassengerSpot>
                        <PassengerSpot id="seat_1778937029719" version="1.0">
                          <Label>18</Label>
                          <Orientation>forwards</Orientation>
                          <actualVehicleEquipments />
                          <SpotColumnRef ref="SpotColumn/id/B" version="1.0" />
                          <SpotRowRef ref="spot_row_1778936987614" version="1.0" />
                          <Centroid>
                            <Location>
                              <pos>9.679678362573105 1.410714</pos>
                            </Location>
                          </Centroid>
                          <Width>0.35</Width>
                          <Length>0.35</Length>
                        </PassengerSpot>
                        <PassengerSpot id="seat_1778937031327" version="1.0">
                          <Label>21</Label>
                          <Orientation>forwards</Orientation>
                          <actualVehicleEquipments />
                          <SpotColumnRef ref="SpotColumn/id/A" version="1.0" />
                          <SpotRowRef ref="spot_row_1778936987173" version="1.0" />
                          <IsByWindow>true</IsByWindow>
                          <Centroid>
                            <Location>
                              <pos>9.153362573099418 1.766429</pos>
                            </Location>
                          </Centroid>
                          <Width>0.35</Width>
                          <Length>0.35</Length>
                        </PassengerSpot>
                        <PassengerSpot id="seat_1778937033231" version="1.0">
                          <Label>22</Label>
                          <Orientation>forwards</Orientation>
                          <actualVehicleEquipments />
                          <SpotColumnRef ref="SpotColumn/id/B" version="1.0" />
                          <SpotRowRef ref="spot_row_1778936987173" version="1.0" />
                          <Centroid>
                            <Location>
                              <pos>9.153362573099418 1.410714</pos>
                            </Location>
                          </Centroid>
                          <Width>0.35</Width>
                          <Length>0.35</Length>
                        </PassengerSpot>
                        <PassengerSpot id="seat_1778937042255" version="1.0">
                          <Label>33</Label>
                          <Orientation>forwards</Orientation>
                          <actualVehicleEquipments />
                          <SpotColumnRef ref="SpotColumn/id/A" version="1.0" />
                          <SpotRowRef ref="spot_row_1778936985294" version="1.0" />
                          <IsByWindow>true</IsByWindow>
                          <Centroid>
                            <Location>
                              <pos>7.5323099415204675 1.766429</pos>
                            </Location>
                          </Centroid>
                          <Width>0.35</Width>
                          <Length>0.35</Length>
                        </PassengerSpot>
                        <PassengerSpot id="seat_1778937043838" version="1.0">
                          <Label>34</Label>
                          <Orientation>forwards</Orientation>
                          <actualVehicleEquipments />
                          <SpotColumnRef ref="SpotColumn/id/B" version="1.0" />
                          <SpotRowRef ref="spot_row_1778936985294" version="1.0" />
                          <Centroid>
                            <Location>
                              <pos>7.5323099415204675 1.410714</pos>
                            </Location>
                          </Centroid>
                          <Width>0.35</Width>
                          <Length>0.35</Length>
                        </PassengerSpot>
                        <PassengerSpot id="seat_1778937045206" version="1.0">
                          <Label>37</Label>
                          <Orientation>forwards</Orientation>
                          <actualVehicleEquipments />
                          <SpotColumnRef ref="SpotColumn/id/A" version="1.0" />
                          <SpotRowRef ref="SpotRow/id/11" version="1.0" />
                          <IsByWindow>true</IsByWindow>
                          <Centroid>
                            <Location>
                              <pos>6.963888888888887 1.766429</pos>
                            </Location>
                          </Centroid>
                          <Width>0.35</Width>
                          <Length>0.35</Length>
                        </PassengerSpot>
                        <PassengerSpot id="seat_1778937046518" version="1.0">
                          <Label>38</Label>
                          <Orientation>forwards</Orientation>
                          <actualVehicleEquipments />
                          <SpotColumnRef ref="SpotColumn/id/B" version="1.0" />
                          <SpotRowRef ref="SpotRow/id/11" version="1.0" />
                          <Centroid>
                            <Location>
                              <pos>6.963888888888887 1.410714</pos>
                            </Location>
                          </Centroid>
                          <Width>0.35</Width>
                          <Length>0.35</Length>
                        </PassengerSpot>
                        <PassengerSpot id="seat_1778937047798" version="1.0">
                          <Label>41</Label>
                          <Orientation>forwards</Orientation>
                          <actualVehicleEquipments />
                          <SpotColumnRef ref="SpotColumn/id/A" version="1.0" />
                          <SpotRowRef ref="SpotRow/id/10" version="1.0" />
                          <IsByWindow>true</IsByWindow>
                          <Centroid>
                            <Location>
                              <pos>6.374415204678361 1.766429</pos>
                            </Location>
                          </Centroid>
                          <Width>0.35</Width>
                          <Length>0.35</Length>
                        </PassengerSpot>
                        <PassengerSpot id="seat_1778937049046" version="1.0">
                          <Label>42</Label>
                          <Orientation>forwards</Orientation>
                          <actualVehicleEquipments />
                          <SpotColumnRef ref="SpotColumn/id/B" version="1.0" />
                          <SpotRowRef ref="SpotRow/id/10" version="1.0" />
                          <Centroid>
                            <Location>
                              <pos>6.374415204678361 1.410714</pos>
                            </Location>
                          </Centroid>
                          <Width>0.35</Width>
                          <Length>0.35</Length>
                        </PassengerSpot>
                        <PassengerSpot id="seat_1778937051598" version="1.0">
                          <Label>45</Label>
                          <Orientation>forwards</Orientation>
                          <actualVehicleEquipments />
                          <SpotColumnRef ref="SpotColumn/id/A" version="1.0" />
                          <SpotRowRef ref="SpotRow/id/9" version="1.0" />
                          <IsByWindow>true</IsByWindow>
                          <Centroid>
                            <Location>
                              <pos>5.82704678362573 1.766429</pos>
                            </Location>
                          </Centroid>
                          <Width>0.35</Width>
                          <Length>0.35</Length>
                        </PassengerSpot>
                        <PassengerSpot id="seat_1778937053102" version="1.0">
                          <Label>46</Label>
                          <Orientation>forwards</Orientation>
                          <actualVehicleEquipments />
                          <SpotColumnRef ref="SpotColumn/id/B" version="1.0" />
                          <SpotRowRef ref="SpotRow/id/9" version="1.0" />
                          <Centroid>
                            <Location>
                              <pos>5.82704678362573 1.410714</pos>
                            </Location>
                          </Centroid>
                          <Width>0.35</Width>
                          <Length>0.35</Length>
                        </PassengerSpot>
                        <PassengerSpot id="seat_1778937054510" version="1.0">
                          <Label>49</Label>
                          <Orientation>forwards</Orientation>
                          <actualVehicleEquipments />
                          <SpotColumnRef ref="SpotColumn/id/A" version="1.0" />
                          <SpotRowRef ref="SpotRow/id/8" version="1.0" />
                          <IsByWindow>true</IsByWindow>
                          <Centroid>
                            <Location>
                              <pos>5.216520467836255 1.766429</pos>
                            </Location>
                          </Centroid>
                          <Width>0.35</Width>
                          <Length>0.35</Length>
                        </PassengerSpot>
                        <PassengerSpot id="seat_1778937056022" version="1.0">
                          <Label>50</Label>
                          <Orientation>forwards</Orientation>
                          <actualVehicleEquipments />
                          <SpotColumnRef ref="SpotColumn/id/B" version="1.0" />
                          <SpotRowRef ref="SpotRow/id/8" version="1.0" />
                          <Centroid>
                            <Location>
                              <pos>5.216520467836255 1.410714</pos>
                            </Location>
                          </Centroid>
                          <Width>0.35</Width>
                          <Length>0.35</Length>
                        </PassengerSpot>
                        <PassengerSpot id="seat_1778937057558" version="1.0">
                          <Label>53</Label>
                          <Orientation>forwards</Orientation>
                          <actualVehicleEquipments />
                          <SpotColumnRef ref="SpotColumn/id/A" version="1.0" />
                          <SpotRowRef ref="SpotRow/id/7" version="1.0" />
                          <IsByWindow>true</IsByWindow>
                          <Centroid>
                            <Location>
                              <pos>4.584941520467836 1.766429</pos>
                            </Location>
                          </Centroid>
                          <Width>0.35</Width>
                          <Length>0.35</Length>
                        </PassengerSpot>
                        <PassengerSpot id="seat_1778937058966" version="1.0">
                          <Label>54</Label>
                          <Orientation>forwards</Orientation>
                          <actualVehicleEquipments />
                          <SpotColumnRef ref="SpotColumn/id/B" version="1.0" />
                          <SpotRowRef ref="SpotRow/id/7" version="1.0" />
                          <Centroid>
                            <Location>
                              <pos>4.584941520467836 1.410714</pos>
                            </Location>
                          </Centroid>
                          <Width>0.35</Width>
                          <Length>0.35</Length>
                        </PassengerSpot>
                        <PassengerSpot id="seat_1778937060670" version="1.0">
                          <Label>83</Label>
                          <Orientation>backwards</Orientation>
                          <actualVehicleEquipments />
                          <SpotColumnRef ref="SpotColumn/id/A" version="1.0" />
                          <SpotRowRef ref="SpotRow/id/6" version="1.0" />
                          <IsByWindow>true</IsByWindow>
                          <Centroid>
                            <Location>
                              <pos>4.016520467836257 1.766429</pos>
                            </Location>
                          </Centroid>
                          <Width>0.35</Width>
                          <Length>0.35</Length>
                        </PassengerSpot>
                        <PassengerSpot id="seat_1778937077717" version="1.0">
                          <Label>84</Label>
                          <Orientation>backwards</Orientation>
                          <actualVehicleEquipments />
                          <SpotColumnRef ref="SpotColumn/id/B" version="1.0" />
                          <SpotRowRef ref="SpotRow/id/6" version="1.0" />
                          <Centroid>
                            <Location>
                              <pos>4.016520467836257 1.410714</pos>
                            </Location>
                          </Centroid>
                          <Width>0.35</Width>
                          <Length>0.35</Length>
                        </PassengerSpot>
                        <PassengerSpot id="seat_1778937094372" version="1.0">
                          <Label>82</Label>
                          <Orientation>backwards</Orientation>
                          <actualVehicleEquipments />
                          <SpotColumnRef ref="SpotColumn/id/D" version="1.0" />
                          <SpotRowRef ref="SpotRow/id/6" version="1.0" />
                          <Centroid>
                            <Location>
                              <pos>4.016520467836257 0.576316</pos>
                            </Location>
                          </Centroid>
                          <Width>0.35</Width>
                          <Length>0.35</Length>
                        </PassengerSpot>
                        <PassengerSpot id="seat_1778937096309" version="1.0">
                          <Label>81</Label>
                          <Orientation>backwards</Orientation>
                          <actualVehicleEquipments />
                          <SpotColumnRef ref="spot_column_1778936952743" version="1.0" />
                          <SpotRowRef ref="SpotRow/id/6" version="1.0" />
                          <IsByWindow>true</IsByWindow>
                          <Centroid>
                            <Location>
                              <pos>4.016520467836257 0.206842</pos>
                            </Location>
                          </Centroid>
                          <Width>0.35</Width>
                          <Length>0.35</Length>
                        </PassengerSpot>
                        <PassengerSpot id="seat_1778937097788" version="1.0">
                          <Label>56</Label>
                          <Orientation>forwards</Orientation>
                          <actualVehicleEquipments />
                          <SpotColumnRef ref="SpotColumn/id/D" version="1.0" />
                          <SpotRowRef ref="SpotRow/id/7" version="1.0" />
                          <IsByAisle>true</IsByAisle>
                          <Centroid>
                            <Location>
                              <pos>4.584941520467836 0.576316</pos>
                            </Location>
                          </Centroid>
                          <Width>0.35</Width>
                          <Length>0.35</Length>
                        </PassengerSpot>
                        <PassengerSpot id="seat_1778937099188" version="1.0">
                          <Label>55</Label>
                          <Orientation>forwards</Orientation>
                          <actualVehicleEquipments />
                          <SpotColumnRef ref="spot_column_1778936952743" version="1.0" />
                          <SpotRowRef ref="SpotRow/id/7" version="1.0" />
                          <IsByWindow>true</IsByWindow>
                          <Centroid>
                            <Location>
                              <pos>4.584941520467836 0.206842</pos>
                            </Location>
                          </Centroid>
                          <Width>0.35</Width>
                          <Length>0.35</Length>
                        </PassengerSpot>
                        <PassengerSpot id="seat_1778937100556" version="1.0">
                          <Label>52</Label>
                          <Orientation>backwards</Orientation>
                          <actualVehicleEquipments />
                          <SpotColumnRef ref="SpotColumn/id/D" version="1.0" />
                          <SpotRowRef ref="SpotRow/id/8" version="1.0" />
                          <Centroid>
                            <Location>
                              <pos>5.216520467836256 0.576316</pos>
                            </Location>
                          </Centroid>
                          <Width>0.35</Width>
                          <Length>0.35</Length>
                        </PassengerSpot>
                        <PassengerSpot id="seat_1778937101980" version="1.0">
                          <Label>51</Label>
                          <Orientation>backwards</Orientation>
                          <actualVehicleEquipments />
                          <SpotColumnRef ref="spot_column_1778936952743" version="1.0" />
                          <SpotRowRef ref="SpotRow/id/8" version="1.0" />
                          <IsByWindow>true</IsByWindow>
                          <Centroid>
                            <Location>
                              <pos>5.216520467836256 0.206842</pos>
                            </Location>
                          </Centroid>
                          <Width>0.35</Width>
                          <Length>0.35</Length>
                        </PassengerSpot>
                        <PassengerSpot id="seat_1778937103612" version="1.0">
                          <Label>48</Label>
                          <Orientation>backwards</Orientation>
                          <actualVehicleEquipments />
                          <SpotColumnRef ref="SpotColumn/id/D" version="1.0" />
                          <SpotRowRef ref="SpotRow/id/9" version="1.0" />
                          <IsByAisle>true</IsByAisle>
                          <Centroid>
                            <Location>
                              <pos>5.82704678362573 0.576316</pos>
                            </Location>
                          </Centroid>
                          <Width>0.35</Width>
                          <Length>0.35</Length>
                        </PassengerSpot>
                        <PassengerSpot id="seat_1778937105060" version="1.0">
                          <Label>47</Label>
                          <Orientation>backwards</Orientation>
                          <actualVehicleEquipments />
                          <SpotColumnRef ref="spot_column_1778936952743" version="1.0" />
                          <SpotRowRef ref="SpotRow/id/9" version="1.0" />
                          <IsByWindow>true</IsByWindow>
                          <Centroid>
                            <Location>
                              <pos>5.82704678362573 0.206842</pos>
                            </Location>
                          </Centroid>
                          <Width>0.35</Width>
                          <Length>0.35</Length>
                        </PassengerSpot>
                        <PassengerSpot id="seat_1778937106668" version="1.0">
                          <Label>44</Label>
                          <Orientation>backwards</Orientation>
                          <actualVehicleEquipments />
                          <SpotColumnRef ref="SpotColumn/id/D" version="1.0" />
                          <SpotRowRef ref="SpotRow/id/10" version="1.0" />
                          <IsByAisle>true</IsByAisle>
                          <Centroid>
                            <Location>
                              <pos>6.374415204678362 0.576316</pos>
                            </Location>
                          </Centroid>
                          <Width>0.35</Width>
                          <Length>0.35</Length>
                        </PassengerSpot>
                        <PassengerSpot id="seat_1778937108868" version="1.0">
                          <Label>43</Label>
                          <Orientation>backwards</Orientation>
                          <actualVehicleEquipments />
                          <SpotColumnRef ref="spot_column_1778936952743" version="1.0" />
                          <SpotRowRef ref="SpotRow/id/10" version="1.0" />
                          <IsByWindow>true</IsByWindow>
                          <Centroid>
                            <Location>
                              <pos>6.374415204678362 0.206842</pos>
                            </Location>
                          </Centroid>
                          <Width>0.35</Width>
                          <Length>0.35</Length>
                        </PassengerSpot>
                        <PassengerSpot id="seat_1778937110571" version="1.0">
                          <Label>40</Label>
                          <Orientation>backwards</Orientation>
                          <actualVehicleEquipments />
                          <SpotColumnRef ref="SpotColumn/id/D" version="1.0" />
                          <SpotRowRef ref="SpotRow/id/11" version="1.0" />
                          <IsByAisle>true</IsByAisle>
                          <Centroid>
                            <Location>
                              <pos>6.963888888888888 0.576316</pos>
                            </Location>
                          </Centroid>
                          <Width>0.35</Width>
                          <Length>0.35</Length>
                        </PassengerSpot>
                        <PassengerSpot id="seat_1778937112164" version="1.0">
                          <Label>39</Label>
                          <Orientation>backwards</Orientation>
                          <actualVehicleEquipments />
                          <SpotColumnRef ref="spot_column_1778936952743" version="1.0" />
                          <SpotRowRef ref="SpotRow/id/11" version="1.0" />
                          <IsByWindow>true</IsByWindow>
                          <Centroid>
                            <Location>
                              <pos>6.963888888888888 0.206842</pos>
                            </Location>
                          </Centroid>
                          <Width>0.35</Width>
                          <Length>0.35</Length>
                        </PassengerSpot>
                        <PassengerSpot id="seat_1778937113752" version="1.0">
                          <Label>36</Label>
                          <Orientation>backwards</Orientation>
                          <actualVehicleEquipments />
                          <SpotColumnRef ref="SpotColumn/id/D" version="1.0" />
                          <SpotRowRef ref="spot_row_1778936985294" version="1.0" />
                          <IsByAisle>true</IsByAisle>
                          <Centroid>
                            <Location>
                              <pos>7.5323099415204675 0.576316</pos>
                            </Location>
                          </Centroid>
                          <Width>0.35</Width>
                          <Length>0.35</Length>
                        </PassengerSpot>
                        <PassengerSpot id="seat_1778937115005" version="1.0">
                          <Label>35</Label>
                          <Orientation>backwards</Orientation>
                          <actualVehicleEquipments />
                          <SpotColumnRef ref="spot_column_1778936952743" version="1.0" />
                          <SpotRowRef ref="spot_row_1778936985294" version="1.0" />
                          <IsByWindow>true</IsByWindow>
                          <Centroid>
                            <Location>
                              <pos>7.5323099415204675 0.206842</pos>
                            </Location>
                          </Centroid>
                          <Width>0.35</Width>
                          <Length>0.35</Length>
                        </PassengerSpot>
                        <PassengerSpot id="seat_1778937123220" version="1.0">
                          <Label>24</Label>
                          <Orientation>backwards</Orientation>
                          <actualVehicleEquipments />
                          <SpotColumnRef ref="SpotColumn/id/D" version="1.0" />
                          <SpotRowRef ref="spot_row_1778936987173" version="1.0" />
                          <IsByAisle>true</IsByAisle>
                          <Centroid>
                            <Location>
                              <pos>9.153362573099418 0.576316</pos>
                            </Location>
                          </Centroid>
                          <Width>0.35</Width>
                          <Length>0.35</Length>
                        </PassengerSpot>
                        <PassengerSpot id="seat_1778937124755" version="1.0">
                          <Label>23</Label>
                          <Orientation>backwards</Orientation>
                          <actualVehicleEquipments />
                          <SpotColumnRef ref="spot_column_1778936952743" version="1.0" />
                          <SpotRowRef ref="spot_row_1778936987173" version="1.0" />
                          <IsByWindow>true</IsByWindow>
                          <Centroid>
                            <Location>
                              <pos>9.153362573099418 0.206842</pos>
                            </Location>
                          </Centroid>
                          <Width>0.35</Width>
                          <Length>0.35</Length>
                        </PassengerSpot>
                        <PassengerSpot id="seat_1778937193640" version="1.0">
                          <Label>20</Label>
                          <Orientation>backwards</Orientation>
                          <actualVehicleEquipments />
                          <SpotColumnRef ref="SpotColumn/id/D" version="1.0" />
                          <SpotRowRef ref="spot_row_1778936987614" version="1.0" />
                          <IsByAisle>true</IsByAisle>
                          <Centroid>
                            <Location>
                              <pos>9.679678362573103 0.576316</pos>
                            </Location>
                          </Centroid>
                          <Width>0.35</Width>
                          <Length>0.35</Length>
                        </PassengerSpot>
                        <PassengerSpot id="seat_1778937195011" version="1.0">
                          <Label>19</Label>
                          <Orientation>backwards</Orientation>
                          <actualVehicleEquipments />
                          <SpotColumnRef ref="spot_column_1778936952743" version="1.0" />
                          <SpotRowRef ref="spot_row_1778936987614" version="1.0" />
                          <IsByWindow>true</IsByWindow>
                          <Centroid>
                            <Location>
                              <pos>9.679678362573103 0.206842</pos>
                            </Location>
                          </Centroid>
                          <Width>0.35</Width>
                          <Length>0.35</Length>
                        </PassengerSpot>
                        <PassengerSpot id="seat_1778937196562" version="1.0">
                          <Label>16</Label>
                          <Orientation>backwards</Orientation>
                          <actualVehicleEquipments />
                          <SpotColumnRef ref="SpotColumn/id/D" version="1.0" />
                          <SpotRowRef ref="spot_row_1778936988038" version="1.0" />
                          <IsByAisle>true</IsByAisle>
                          <Centroid>
                            <Location>
                              <pos>10.216783625730997 0.576316</pos>
                            </Location>
                          </Centroid>
                          <Width>0.35</Width>
                          <Length>0.35</Length>
                        </PassengerSpot>
                        <PassengerSpot id="seat_1778937197906" version="1.0">
                          <Label>15</Label>
                          <Orientation>backwards</Orientation>
                          <actualVehicleEquipments />
                          <SpotColumnRef ref="spot_column_1778936952743" version="1.0" />
                          <SpotRowRef ref="spot_row_1778936988038" version="1.0" />
                          <IsByWindow>true</IsByWindow>
                          <Centroid>
                            <Location>
                              <pos>10.216783625730997 0.206842</pos>
                            </Location>
                          </Centroid>
                          <Width>0.35</Width>
                          <Length>0.35</Length>
                        </PassengerSpot>
                        <PassengerSpot id="seat_1778937199434" version="1.0">
                          <Label>12</Label>
                          <Orientation>backwards</Orientation>
                          <actualVehicleEquipments />
                          <SpotColumnRef ref="SpotColumn/id/D" version="1.0" />
                          <SpotRowRef ref="spot_row_1778936988454" version="1.0" />
                          <Centroid>
                            <Location>
                              <pos>10.790467836257314 0.576316</pos>
                            </Location>
                          </Centroid>
                          <Width>0.35</Width>
                          <Length>0.35</Length>
                        </PassengerSpot>
                        <PassengerSpot id="seat_1778937201099" version="1.0">
                          <Label>11</Label>
                          <Orientation>backwards</Orientation>
                          <actualVehicleEquipments />
                          <SpotColumnRef ref="spot_column_1778936952743" version="1.0" />
                          <SpotRowRef ref="spot_row_1778936988454" version="1.0" />
                          <IsByWindow>true</IsByWindow>
                          <Centroid>
                            <Location>
                              <pos>10.790467836257314 0.206842</pos>
                            </Location>
                          </Centroid>
                          <Width>0.35</Width>
                          <Length>0.35</Length>
                        </PassengerSpot>
                        <PassengerSpot id="seat_1778937203011" version="1.0">
                          <Label>8</Label>
                          <Orientation>backwards</Orientation>
                          <actualVehicleEquipments />
                          <SpotColumnRef ref="SpotColumn/id/D" version="1.0" />
                          <SpotRowRef ref="spot_row_1778936988839" version="1.0" />
                          <Centroid>
                            <Location>
                              <pos>11.393174603174609 0.576316</pos>
                            </Location>
                          </Centroid>
                          <Width>0.35</Width>
                          <Length>0.35</Length>
                        </PassengerSpot>
                        <PassengerSpot id="seat_1778937204314" version="1.0">
                          <Label>7</Label>
                          <Orientation>backwards</Orientation>
                          <actualVehicleEquipments />
                          <SpotColumnRef ref="spot_column_1778936952743" version="1.0" />
                          <SpotRowRef ref="spot_row_1778936988839" version="1.0" />
                          <IsByWindow>true</IsByWindow>
                          <Centroid>
                            <Location>
                              <pos>11.393174603174609 0.206842</pos>
                            </Location>
                          </Centroid>
                          <Width>0.35</Width>
                          <Length>0.35</Length>
                        </PassengerSpot>
                        <PassengerSpot id="seat_1778937205770" version="1.0">
                          <Label>4</Label>
                          <Orientation>backwards</Orientation>
                          <actualVehicleEquipments />
                          <SpotColumnRef ref="SpotColumn/id/D" version="1.0" />
                          <SpotRowRef ref="spot_row_1778936989382" version="1.0" />
                          <Centroid>
                            <Location>
                              <pos>12.015714285714289 0.576316</pos>
                            </Location>
                          </Centroid>
                          <Width>0.35</Width>
                          <Length>0.35</Length>
                        </PassengerSpot>
                        <PassengerSpot id="seat_1778937207563" version="1.0">
                          <Label>3</Label>
                          <Orientation>backwards</Orientation>
                          <actualVehicleEquipments />
                          <SpotColumnRef ref="spot_column_1778936952743" version="1.0" />
                          <SpotRowRef ref="spot_row_1778936989382" version="1.0" />
                          <IsByWindow>true</IsByWindow>
                          <Centroid>
                            <Location>
                              <pos>12.015714285714289 0.206842</pos>
                            </Location>
                          </Centroid>
                          <Width>0.35</Width>
                          <Length>0.35</Length>
                        </PassengerSpot>
                      </passengerSpots>
                      <luggageSpots />
                      <deckEntrances>
                        <PassengerEntrance id="entrance_1779021475977" version="1.0">
                          <Name>Entrance</Name>
                          <Label>E</Label>
                          <Width>0.6</Width>
                          <Height>2</Height>
                          <actualVehicleEquipments />
                          <PublicUse>true</PublicUse>
                          <VehicleSide>leftSide</VehicleSide>
                          <DeckEntranceType>external</DeckEntranceType>
                          <Centroid>
                            <Location>
                              <pos>0.12 1.84</pos>
                            </Location>
                          </Centroid>
                        </PassengerEntrance>
                        <PassengerEntrance id="entrance_1779021477501" version="1.0">
                          <Name>Entrance</Name>
                          <Label>E</Label>
                          <Width>0.6</Width>
                          <Height>2</Height>
                          <actualVehicleEquipments />
                          <PublicUse>true</PublicUse>
                          <VehicleSide>leftSide</VehicleSide>
                          <DeckEntranceType>external</DeckEntranceType>
                          <Centroid>
                            <Location>
                              <pos>12.38 -0.06</pos>
                            </Location>
                          </Centroid>
                        </PassengerEntrance>
                        <PassengerEntrance id="entrance_1779021478836" version="1.0">
                          <Name>Entrance</Name>
                          <Label>E</Label>
                          <Width>0.6</Width>
                          <Height>2</Height>
                          <actualVehicleEquipments />
                          <PublicUse>true</PublicUse>
                          <VehicleSide>leftSide</VehicleSide>
                          <DeckEntranceType>external</DeckEntranceType>
                          <Centroid>
                            <Location>
                              <pos>12.36 1.88</pos>
                            </Location>
                          </Centroid>
                        </PassengerEntrance>
                        <PassengerEntrance id="entrance_1779021480092" version="1.0">
                          <Name>Entrance</Name>
                          <Label>E</Label>
                          <Width>0.6</Width>
                          <Height>2</Height>
                          <actualVehicleEquipments />
                          <PublicUse>true</PublicUse>
                          <VehicleSide>leftSide</VehicleSide>
                          <SequenceFromFront>2.14</SequenceFromFront>
                          <DeckEntranceType>external</DeckEntranceType>
                          <Centroid>
                            <Location>
                              <pos>0.1 -0.04</pos>
                            </Location>
                          </Centroid>
                        </PassengerEntrance>
                      </deckEntrances>
                      <deckEntranceUsage />
                      <deckEntranceCouples />
                      <deckSpaceCapacities />
                      <actualVehicleEquipments />
                      <PublicUse>true</PublicUse>
                      <FareClass>Standard</FareClass>
                    </PassengerSpace>
                    <PassengerSpace id="seating-area_1778937141072" version="1.0">
                      <Name>Premium Seats</Name>
                      <PassengerSpaceType>seatingArea</PassengerSpaceType>
                      <passengerSpots>
                        <PassengerSpot id="seat_1778937035630" version="1.0">
                          <Label>25</Label>
                          <Orientation>forwards</Orientation>
                          <actualVehicleEquipments />
                          <SpotColumnRef ref="SpotColumn/id/A" version="1.0" />
                          <SpotRowRef ref="spot_row_1778936986822" version="1.0" />
                          <IsByWindow>true</IsByWindow>
                          <Centroid>
                            <Location>
                              <pos>8.648099415204678 1.766429</pos>
                            </Location>
                          </Centroid>
                          <Width>0.35</Width>
                          <Length>0.35</Length>
                        </PassengerSpot>
                        <PassengerSpot id="seat_1778937037486" version="1.0">
                          <Label>26</Label>
                          <Orientation>forwards</Orientation>
                          <actualVehicleEquipments />
                          <SpotColumnRef ref="SpotColumn/id/B" version="1.0" />
                          <SpotRowRef ref="spot_row_1778936986822" version="1.0" />
                          <Centroid>
                            <Location>
                              <pos>8.648099415204678 1.410714</pos>
                            </Location>
                          </Centroid>
                          <Width>0.35</Width>
                          <Length>0.35</Length>
                        </PassengerSpot>
                        <PassengerSpot id="seat_1778937039071" version="1.0">
                          <Label>29</Label>
                          <Orientation>forwards</Orientation>
                          <actualVehicleEquipments />
                          <SpotColumnRef ref="SpotColumn/id/A" version="1.0" />
                          <SpotRowRef ref="spot_row_1778936986382" version="1.0" />
                          <IsByWindow>true</IsByWindow>
                          <Centroid>
                            <Location>
                              <pos>8.111257309941521 1.766429</pos>
                            </Location>
                          </Centroid>
                          <Width>0.35</Width>
                          <Length>0.35</Length>
                        </PassengerSpot>
                        <PassengerSpot id="seat_1778937040542" version="1.0">
                          <Label>30</Label>
                          <Orientation>forwards</Orientation>
                          <actualVehicleEquipments />
                          <SpotColumnRef ref="SpotColumn/id/B" version="1.0" />
                          <SpotRowRef ref="spot_row_1778936986382" version="1.0" />
                          <Centroid>
                            <Location>
                              <pos>8.111257309941521 1.410714</pos>
                            </Location>
                          </Centroid>
                          <Width>0.35</Width>
                          <Length>0.35</Length>
                        </PassengerSpot>
                        <PassengerSpot id="seat_1778937117116" version="1.0">
                          <Label>32</Label>
                          <Orientation>backwards</Orientation>
                          <actualVehicleEquipments />
                          <SpotColumnRef ref="SpotColumn/id/D" version="1.0" />
                          <SpotRowRef ref="spot_row_1778936986382" version="1.0" />
                          <IsByAisle>true</IsByAisle>
                          <Centroid>
                            <Location>
                              <pos>8.111257309941521 0.576316</pos>
                            </Location>
                          </Centroid>
                          <Width>0.35</Width>
                          <Length>0.35</Length>
                        </PassengerSpot>
                        <PassengerSpot id="seat_1778937118571" version="1.0">
                          <Label>31</Label>
                          <Orientation>backwards</Orientation>
                          <actualVehicleEquipments />
                          <SpotColumnRef ref="spot_column_1778936952743" version="1.0" />
                          <SpotRowRef ref="spot_row_1778936986382" version="1.0" />
                          <IsByWindow>true</IsByWindow>
                          <Centroid>
                            <Location>
                              <pos>8.111257309941521 0.206842</pos>
                            </Location>
                          </Centroid>
                          <Width>0.35</Width>
                          <Length>0.35</Length>
                        </PassengerSpot>
                        <PassengerSpot id="seat_1778937120156" version="1.0">
                          <Label>28</Label>
                          <Orientation>backwards</Orientation>
                          <actualVehicleEquipments />
                          <SpotColumnRef ref="SpotColumn/id/D" version="1.0" />
                          <SpotRowRef ref="spot_row_1778936986822" version="1.0" />
                          <IsByAisle>true</IsByAisle>
                          <Centroid>
                            <Location>
                              <pos>8.648099415204678 0.576316</pos>
                            </Location>
                          </Centroid>
                          <Width>0.35</Width>
                          <Length>0.35</Length>
                        </PassengerSpot>
                        <PassengerSpot id="seat_1778937121628" version="1.0">
                          <Label>27</Label>
                          <Orientation>backwards</Orientation>
                          <actualVehicleEquipments />
                          <SpotColumnRef ref="spot_column_1778936952743" version="1.0" />
                          <SpotRowRef ref="spot_row_1778936986822" version="1.0" />
                          <IsByWindow>true</IsByWindow>
                          <Centroid>
                            <Location>
                              <pos>8.648099415204678 0.206842</pos>
                            </Location>
                          </Centroid>
                          <Width>0.35</Width>
                          <Length>0.35</Length>
                        </PassengerSpot>
                      </passengerSpots>
                      <luggageSpots />
                      <deckEntrances />
                      <deckEntranceUsage />
                      <deckEntranceCouples />
                      <deckSpaceCapacities />
                      <actualVehicleEquipments />
                      <PublicUse>true</PublicUse>
                      <FareClass>High</FareClass>
                    </PassengerSpace>
                  </deckSpaces>
                  <DeckLevelRef ref="deck_level_0" version="1.0" />
                  <Name />
                  <Width>2</Width>
                  <Length>13</Length>
                </Deck>
              </decks>
              <deckLevels>
                <DeckLevel id="deck_level_0" version="1.0">
                  <Label>Level 0</Label>
                </DeckLevel>
              </deckLevels>
            </DeckPlan>
          </deckPlans>
          <schematicMaps>
            <SchematicMap>
              <Name>Talent 3 seat map</Name>
              <ImageUri>https://www.example.com</ImageUri>
              <DepictedObjectRef ref="Train/id/1" />
            </SchematicMap>
          </schematicMaps>
        </ResourceFrame>
      </frames>
    </CompositeFrame>
  </dataObjects>
</PublicationDelivery>`})),Gn,Kn=e((()=>{Gn=`<?xml version="1.0" encoding="utf-8"?>
<PublicationDelivery version="1.2.2" schemaLocation="http://www.netex.org.uk/netex file:///home/robin/Projekte/NeTEx/xsd/NeTEx_publication.xsd">
  <PublicationTimestamp>2020-12-17T09:30:47.0Z</PublicationTimestamp>
  <ParticipantRef>SYS001</ParticipantRef>
  <dataObjects>
    <CompositeFrame version="any" id="CompositeFrame/id/1">
      <frames>
        <ResourceFrame version="any" id="ResourceFrame/id/1">
          <equipments>
            <AccessVehicleEquipment id="AccessVehicleEquipment/id/1" version="any">
              <Name>Ramp</Name>
              <Fixed>false</Fixed>
              <LowFloor>false</LowFloor>
              <HighFloor>false</HighFloor>
              <Ramp>true</Ramp>
            </AccessVehicleEquipment>
            <AccessVehicleEquipment id="AccessVehicleEquipment/id/2" version="any">
              <Name>Lift</Name>
              <Fixed>false</Fixed>
              <LowFloor>false</LowFloor>
              <HighFloor>false</HighFloor>
              <Ramp>false</Ramp>
            </AccessVehicleEquipment>
            <AccessVehicleEquipment id="AccessVehicleEquipment/id/3" version="any">
              <Name>Entrance dimensions</Name>
              <Fixed>false</Fixed>
              <LowFloor>false</LowFloor>
              <HighFloor>false</HighFloor>
              <Ramp>false</Ramp>
            </AccessVehicleEquipment>
          </equipments>
          <serviceFacilitySets>
            <ServiceFacilitySet version="any" id="ServiceFacilityTrain">
              <PassengerInformationFacilityList>nextStopIndicator

                stopAnnouncements</PassengerInformationFacilityList>
              <SanitaryFacilityList>toilet
                wheelchairAccessToilet</SanitaryFacilityList>
              <TicketingFacilityList />
            </ServiceFacilitySet>
            <ServiceFacilitySet version="any" id="ServiceFacilityQuiet">
              <NuisanceFacilityList>mobilePhoneFreeZone</NuisanceFacilityList>
            </ServiceFacilitySet>
          </serviceFacilitySets>
          <vehicleTypes>
            <Train version="any" id="Train/id/1">
              <Name>Talent 3</Name>
              <Description>4 Teiler</Description>
              <ReversingDirection>true</ReversingDirection>
              <SelfPropelled>true</SelfPropelled>
              <PropulsionType>electric</PropulsionType>
              <TransportMode>rail</TransportMode>
              <capacities>
                <PassengerCapacity version="any" id="PassengerCapacity/id/1">
                  <FareClass>firstClass</FareClass>
                  <SeatingCapacity>8</SeatingCapacity>
                </PassengerCapacity>
                <PassengerCapacity version="any" id="PassengerCapacity/id/2">
                  <FareClass>secondClass</FareClass>
                  <SeatingCapacity>207</SeatingCapacity>
                  <StandingCapacity>275</StandingCapacity>
                  <WheelchairPlaceCapacity>2</WheelchairPlaceCapacity>
                  <BicycleRackCapacity>33</BicycleRackCapacity>
                </PassengerCapacity>
              </capacities>
              <LowFloor>false</LowFloor>
              <HasLiftOrRamp>true</HasLiftOrRamp>
              <BoardingHeight>0.6</BoardingHeight>
              <Length>72.3</Length>
              <Width>2.926</Width>
              <Height>4.26</Height>
              <facilities>
                <ServiceFacilitySetRef version="any" ref="ServiceFacilityTrain" />
              </facilities>
              <components>
                <TrainComponent version="any" id="TrainComponent/id/1">
                  <Label>201-3</Label>
                  <TractiveElementTypeRef version="any" ref="TractiveElementType/id/T3-1" />
                  <OperationalOrientation>forwards</OperationalOrientation>
                  <ForwardCoupling>
                    <Splittable>true</Splittable>
                    <ThroughAccess>noThroughAccess</ThroughAccess>
                  </ForwardCoupling>
                </TrainComponent>
                <TrainComponent version="any" id="TrainComponent/id/2">
                  <Label>201-8</Label>
                  <TrailingElementTypeRef version="any" ref="TrailingElementType/id/M3-1" />
                  <OperationalOrientation>forwards</OperationalOrientation>
                  <ForwardCoupling>
                    <Splittable>true</Splittable>
                    <ThroughAccess>openEntrance</ThroughAccess>
                  </ForwardCoupling>
                </TrainComponent>
                <TrainComponent version="any" id="TrainComponent/id/3">
                  <Label>701-7</Label>
                  <TrailingElementTypeRef version="any" ref="TrailingElementType/id/M2-1" />
                  <OperationalOrientation>forwards</OperationalOrientation>
                  <ForwardCoupling>
                    <Splittable>true</Splittable>
                    <ThroughAccess>openEntrance</ThroughAccess>
                  </ForwardCoupling>
                </TrainComponent>
                <TrainComponent version="any" id="TrainComponent/id/4">
                  <Label>701-9</Label>
                  <TractiveElementTypeRef version="any" ref="TractiveElementType/id/T2-1" />
                  <OperationalOrientation>forwards</OperationalOrientation>
                  <ForwardCoupling>
                    <Splittable>true</Splittable>
                    <ThroughAccess>openEntrance</ThroughAccess>
                  </ForwardCoupling>
                </TrainComponent>
              </components>
            </Train>
          </vehicleTypes>
          <trainElementTypes>
            <TractiveElementType version="any" id="TractiveElementType/id/T3-1">
              <Name>T3-1</Name>
              <TrainElementType>engine</TrainElementType>
              <Length>20.05</Length>
              <Width>2.926</Width>
              <Height>4.26</Height>
              <DeckPlanRef version="any" ref="DeckPlan/id/1" />
            </TractiveElementType>
            <TractiveElementType version="any" id="TractiveElementType/id/T2-1">
              <Name>T2-1</Name>
              <TrainElementType>engine</TrainElementType>
              <Length>20.05</Length>
              <Width>2.926</Width>
              <Height>4.26</Height>
            </TractiveElementType>
            <TrailingElementType version="any" id="TrailingElementType/id/M3-1">
              <Name>M3-1</Name>
              <TrainElementType>carriage</TrainElementType>
              <Length>16.1</Length>
              <Width>2.926</Width>
              <Height>4.26</Height>
            </TrailingElementType>
            <TrailingElementType version="any" id="TrailingElementType/id/M2-1">
              <Name>M2-1</Name>
              <TrainElementType>carriage</TrainElementType>
              <Length>16.1</Length>
              <Width>2.926</Width>
              <Height>4.26</Height>
            </TrailingElementType>
          </trainElementTypes>
          <deckPlans>
            <DeckPlan id="DeckPlan/id/1" version="any">
              <xmlTagName />
              <decks>
                <Deck id="Deck/id/1" version="any">
                  <spotRows>
                    <SpotRow id="SpotRow/id/1" />
                    <SpotRow id="SpotRow/id/2" />
                    <SpotRow id="SpotRow/id/3" />
                    <SpotRow id="SpotRow/id/4" />
                    <SpotRow id="SpotRow/id/5" />
                    <SpotRow id="SpotRow/id/6" />
                    <SpotRow id="SpotRow/id/7" />
                    <SpotRow id="SpotRow/id/8" />
                    <SpotRow id="SpotRow/id/9" />
                    <SpotRow id="SpotRow/id/10" />
                    <SpotRow id="SpotRow/id/11" />
                    <SpotRow id="spot_row_1778936985294" />
                    <SpotRow id="spot_row_1778936986382" />
                    <SpotRow id="spot_row_1778936986822" />
                    <SpotRow id="spot_row_1778936987173" />
                    <SpotRow id="spot_row_1778936987614" />
                    <SpotRow id="spot_row_1778936988038" />
                    <SpotRow id="spot_row_1778936988454" />
                    <SpotRow id="spot_row_1778936988839" />
                    <SpotRow id="spot_row_1778936989382" />
                    <SpotRow id="spot_row_1778949628771" />
                    <SpotRow id="spot_row_1778949629523" />
                  </spotRows>
                  <spotColumns>
                    <SpotColumn id="SpotColumn/id/A" />
                    <SpotColumn id="SpotColumn/id/B" />
                    <SpotColumn id="SpotColumn/id/C" />
                    <SpotColumn id="SpotColumn/id/D" />
                    <SpotColumn id="spot_column_1778936952743" />
                  </spotColumns>
                  <deckSpaces>
                    <PassengerSpace id="space_1778949529557" version="1.0">
                      <Name>Main Space</Name>
                      <SmokingAllowed>false</SmokingAllowed>
                      <StandingAllowed>true</StandingAllowed>
                      <PassengerSpaceType>seatingArea</PassengerSpaceType>
                      <passengerSpots>
                        <PassengerSpot id="seat_1778949525378" version="1.0">
                          <Label>144</Label>
                          <Orientation>forwards</Orientation>
                          <actualVehicleEquipments />
                          <SpotColumnRef ref="SpotColumn/id/D" version="1.0" />
                          <SpotRowRef ref="SpotRow/id/2" version="1.0" />
                          <Centroid>
                            <Location>
                              <pos>2.1352564102564098 0.585</pos>
                            </Location>
                          </Centroid>
                          <Width>0.35</Width>
                          <Length>0.35</Length>
                        </PassengerSpot>
                        <PassengerSpot id="seat_1778949529558" version="1.0">
                          <Label>143</Label>
                          <Orientation>forwards</Orientation>
                          <actualVehicleEquipments />
                          <SpotColumnRef ref="spot_column_1778936952743" version="1.0" />
                          <SpotRowRef ref="SpotRow/id/2" version="1.0" />
                          <IsByWindow>true</IsByWindow>
                          <Centroid>
                            <Location>
                              <pos>2.1352564102564098 0.23</pos>
                            </Location>
                          </Centroid>
                          <Width>0.35</Width>
                          <Length>0.35</Length>
                        </PassengerSpot>
                        <PassengerSpot id="seat_1778949530908" version="1.0">
                          <Label>140</Label>
                          <Orientation>forwards</Orientation>
                          <actualVehicleEquipments />
                          <SpotColumnRef ref="SpotColumn/id/D" version="1.0" />
                          <SpotRowRef ref="SpotRow/id/3" version="1.0" />
                          <Centroid>
                            <Location>
                              <pos>2.6804487179487166 0.585</pos>
                            </Location>
                          </Centroid>
                          <Width>0.35</Width>
                          <Length>0.35</Length>
                        </PassengerSpot>
                        <PassengerSpot id="seat_1778949532995" version="1.0">
                          <Label>139</Label>
                          <Orientation>forwards</Orientation>
                          <actualVehicleEquipments />
                          <SpotColumnRef ref="spot_column_1778936952743" version="1.0" />
                          <SpotRowRef ref="SpotRow/id/3" version="1.0" />
                          <IsByWindow>true</IsByWindow>
                          <Centroid>
                            <Location>
                              <pos>2.6804487179487166 0.23</pos>
                            </Location>
                          </Centroid>
                          <Width>0.35</Width>
                          <Length>0.35</Length>
                        </PassengerSpot>
                        <PassengerSpot id="seat_1778949534364" version="1.0">
                          <Label>141</Label>
                          <Orientation>forwards</Orientation>
                          <actualVehicleEquipments />
                          <SpotColumnRef ref="SpotColumn/id/A" version="1.0" />
                          <SpotRowRef ref="SpotRow/id/3" version="1.0" />
                          <IsByWindow>true</IsByWindow>
                          <Centroid>
                            <Location>
                              <pos>2.6804487179487166 1.775</pos>
                            </Location>
                          </Centroid>
                          <Width>0.35</Width>
                          <Length>0.35</Length>
                        </PassengerSpot>
                        <PassengerSpot id="seat_1778949536061" version="1.0">
                          <Label>136</Label>
                          <Orientation>forwards</Orientation>
                          <actualVehicleEquipments />
                          <SpotColumnRef ref="SpotColumn/id/D" version="1.0" />
                          <SpotRowRef ref="SpotRow/id/4" version="1.0" />
                          <Centroid>
                            <Location>
                              <pos>3.2535256410256403 0.585</pos>
                            </Location>
                          </Centroid>
                          <Width>0.35</Width>
                          <Length>0.35</Length>
                        </PassengerSpot>
                        <PassengerSpot id="seat_1778949538308" version="1.0">
                          <Label>135</Label>
                          <Orientation>forwards</Orientation>
                          <actualVehicleEquipments />
                          <SpotColumnRef ref="spot_column_1778936952743" version="1.0" />
                          <SpotRowRef ref="SpotRow/id/4" version="1.0" />
                          <IsByWindow>true</IsByWindow>
                          <Centroid>
                            <Location>
                              <pos>3.2535256410256403 0.23</pos>
                            </Location>
                          </Centroid>
                          <Width>0.35</Width>
                          <Length>0.35</Length>
                        </PassengerSpot>
                        <PassengerSpot id="seat_1778949539995" version="1.0">
                          <Label>132</Label>
                          <Orientation>forwards</Orientation>
                          <actualVehicleEquipments />
                          <SpotColumnRef ref="SpotColumn/id/D" version="1.0" />
                          <SpotRowRef ref="SpotRow/id/5" version="1.0" />
                          <Centroid>
                            <Location>
                              <pos>3.8573717948717934 0.585</pos>
                            </Location>
                          </Centroid>
                          <Width>0.35</Width>
                          <Length>0.35</Length>
                        </PassengerSpot>
                        <PassengerSpot id="seat_1778949542324" version="1.0">
                          <Label>131</Label>
                          <Orientation>forwards</Orientation>
                          <actualVehicleEquipments />
                          <SpotColumnRef ref="spot_column_1778936952743" version="1.0" />
                          <SpotRowRef ref="SpotRow/id/5" version="1.0" />
                          <IsByWindow>true</IsByWindow>
                          <Centroid>
                            <Location>
                              <pos>3.8573717948717934 0.23</pos>
                            </Location>
                          </Centroid>
                          <Width>0.35</Width>
                          <Length>0.35</Length>
                        </PassengerSpot>
                        <PassengerSpot id="seat_1778949544524" version="1.0">
                          <Label>128</Label>
                          <Orientation>forwards</Orientation>
                          <actualVehicleEquipments />
                          <SpotColumnRef ref="SpotColumn/id/D" version="1.0" />
                          <SpotRowRef ref="SpotRow/id/6" version="1.0" />
                          <Centroid>
                            <Location>
                              <pos>4.472756410256409 0.585</pos>
                            </Location>
                          </Centroid>
                          <Width>0.35</Width>
                          <Length>0.35</Length>
                        </PassengerSpot>
                        <PassengerSpot id="seat_1778949547180" version="1.0">
                          <Label>127</Label>
                          <Orientation>forwards</Orientation>
                          <actualVehicleEquipments />
                          <SpotColumnRef ref="spot_column_1778936952743" version="1.0" />
                          <SpotRowRef ref="SpotRow/id/6" version="1.0" />
                          <IsByWindow>true</IsByWindow>
                          <Centroid>
                            <Location>
                              <pos>4.472756410256409 0.23</pos>
                            </Location>
                          </Centroid>
                          <Width>0.35</Width>
                          <Length>0.35</Length>
                        </PassengerSpot>
                        <PassengerSpot id="seat_1778949548557" version="1.0">
                          <Label>137</Label>
                          <Orientation>forwards</Orientation>
                          <actualVehicleEquipments />
                          <SpotColumnRef ref="SpotColumn/id/A" version="1.0" />
                          <SpotRowRef ref="SpotRow/id/4" version="1.0" />
                          <IsByWindow>true</IsByWindow>
                          <Centroid>
                            <Location>
                              <pos>3.2535256410256403 1.775</pos>
                            </Location>
                          </Centroid>
                          <Width>0.35</Width>
                          <Length>0.35</Length>
                        </PassengerSpot>
                        <PassengerSpot id="seat_1778949550116" version="1.0">
                          <Label>133</Label>
                          <Orientation>forwards</Orientation>
                          <actualVehicleEquipments />
                          <SpotColumnRef ref="SpotColumn/id/A" version="1.0" />
                          <SpotRowRef ref="SpotRow/id/5" version="1.0" />
                          <IsByWindow>true</IsByWindow>
                          <Centroid>
                            <Location>
                              <pos>3.8573717948717934 1.775</pos>
                            </Location>
                          </Centroid>
                          <Width>0.35</Width>
                          <Length>0.35</Length>
                        </PassengerSpot>
                        <PassengerSpot id="seat_1778949553005" version="1.0">
                          <Label>129</Label>
                          <Orientation>forwards</Orientation>
                          <actualVehicleEquipments />
                          <SpotColumnRef ref="SpotColumn/id/A" version="1.0" />
                          <SpotRowRef ref="SpotRow/id/6" version="1.0" />
                          <IsByWindow>true</IsByWindow>
                          <Centroid>
                            <Location>
                              <pos>4.472756410256409 1.775</pos>
                            </Location>
                          </Centroid>
                          <Width>0.35</Width>
                          <Length>0.35</Length>
                        </PassengerSpot>
                        <PassengerSpot id="seat_1778949554387" version="1.0">
                          <Label>121</Label>
                          <Orientation>backwards</Orientation>
                          <actualVehicleEquipments />
                          <SpotColumnRef ref="SpotColumn/id/A" version="1.0" />
                          <SpotRowRef ref="SpotRow/id/9" version="1.0" />
                          <IsByWindow>true</IsByWindow>
                          <Centroid>
                            <Location>
                              <pos>5.84775641025641 1.775</pos>
                            </Location>
                          </Centroid>
                          <Width>0.35</Width>
                          <Length>0.35</Length>
                        </PassengerSpot>
                        <PassengerSpot id="seat_1778949558285" version="1.0">
                          <Label>120</Label>
                          <Orientation>backwards</Orientation>
                          <actualVehicleEquipments />
                          <SpotColumnRef ref="SpotColumn/id/D" version="1.0" />
                          <SpotRowRef ref="SpotRow/id/9" version="1.0" />
                          <Centroid>
                            <Location>
                              <pos>5.84775641025641 0.585</pos>
                            </Location>
                          </Centroid>
                          <Width>0.35</Width>
                          <Length>0.35</Length>
                        </PassengerSpot>
                        <PassengerSpot id="seat_1778949559700" version="1.0">
                          <Label>119</Label>
                          <Orientation>backwards</Orientation>
                          <actualVehicleEquipments />
                          <SpotColumnRef ref="spot_column_1778936952743" version="1.0" />
                          <SpotRowRef ref="SpotRow/id/9" version="1.0" />
                          <IsByWindow>true</IsByWindow>
                          <Centroid>
                            <Location>
                              <pos>5.84775641025641 0.23</pos>
                            </Location>
                          </Centroid>
                          <Width>0.35</Width>
                          <Length>0.35</Length>
                        </PassengerSpot>
                        <PassengerSpot id="seat_1778949561004" version="1.0">
                          <Label>116</Label>
                          <Orientation>backwards</Orientation>
                          <actualVehicleEquipments />
                          <SpotColumnRef ref="SpotColumn/id/D" version="1.0" />
                          <SpotRowRef ref="SpotRow/id/10" version="1.0" />
                          <Centroid>
                            <Location>
                              <pos>6.451602564102564 0.585</pos>
                            </Location>
                          </Centroid>
                          <Width>0.35</Width>
                          <Length>0.35</Length>
                        </PassengerSpot>
                        <PassengerSpot id="seat_1778949565540" version="1.0">
                          <Label>115</Label>
                          <Orientation>backwards</Orientation>
                          <actualVehicleEquipments />
                          <SpotColumnRef ref="spot_column_1778936952743" version="1.0" />
                          <SpotRowRef ref="SpotRow/id/10" version="1.0" />
                          <IsByWindow>true</IsByWindow>
                          <Centroid>
                            <Location>
                              <pos>6.451602564102564 0.23</pos>
                            </Location>
                          </Centroid>
                          <Width>0.35</Width>
                          <Length>0.35</Length>
                        </PassengerSpot>
                        <PassengerSpot id="seat_1778949570101" version="1.0">
                          <Label>117</Label>
                          <Orientation>backwards</Orientation>
                          <actualVehicleEquipments />
                          <SpotColumnRef ref="SpotColumn/id/A" version="1.0" />
                          <SpotRowRef ref="SpotRow/id/10" version="1.0" />
                          <IsByWindow>true</IsByWindow>
                          <Centroid>
                            <Location>
                              <pos>6.451602564102564 1.775</pos>
                            </Location>
                          </Centroid>
                          <Width>0.35</Width>
                          <Length>0.35</Length>
                        </PassengerSpot>
                        <PassengerSpot id="seat_1778949573539" version="1.0">
                          <Label>113</Label>
                          <Orientation>backwards</Orientation>
                          <actualVehicleEquipments />
                          <SpotColumnRef ref="SpotColumn/id/A" version="1.0" />
                          <SpotRowRef ref="SpotRow/id/11" version="1.0" />
                          <IsByWindow>true</IsByWindow>
                          <Centroid>
                            <Location>
                              <pos>7.026602564102564 1.775</pos>
                            </Location>
                          </Centroid>
                          <Width>0.35</Width>
                          <Length>0.35</Length>
                        </PassengerSpot>
                        <PassengerSpot id="seat_1778949574772" version="1.0">
                          <Label>109</Label>
                          <Orientation>backwards</Orientation>
                          <actualVehicleEquipments />
                          <SpotColumnRef ref="SpotColumn/id/A" version="1.0" />
                          <SpotRowRef ref="spot_row_1778936985294" version="1.0" />
                          <IsByWindow>true</IsByWindow>
                          <Centroid>
                            <Location>
                              <pos>7.589102564102564 1.775</pos>
                            </Location>
                          </Centroid>
                          <Width>0.35</Width>
                          <Length>0.35</Length>
                        </PassengerSpot>
                        <PassengerSpot id="seat_1778949578028" version="1.0">
                          <Label>103</Label>
                          <Orientation>backwards</Orientation>
                          <actualVehicleEquipments />
                          <SpotColumnRef ref="SpotColumn/id/A" version="1.0" />
                          <SpotRowRef ref="spot_row_1778936986382" version="1.0" />
                          <IsByWindow>true</IsByWindow>
                          <Centroid>
                            <Location>
                              <pos>8.208333333333334 1.775</pos>
                            </Location>
                          </Centroid>
                          <Width>0.35</Width>
                          <Length>0.35</Length>
                        </PassengerSpot>
                        <PassengerSpot id="seat_1778949579540" version="1.0">
                          <Label>112</Label>
                          <Orientation>backwards</Orientation>
                          <actualVehicleEquipments />
                          <SpotColumnRef ref="SpotColumn/id/D" version="1.0" />
                          <SpotRowRef ref="SpotRow/id/11" version="1.0" />
                          <Centroid>
                            <Location>
                              <pos>7.026602564102564 0.585</pos>
                            </Location>
                          </Centroid>
                          <Width>0.35</Width>
                          <Length>0.35</Length>
                        </PassengerSpot>
                        <PassengerSpot id="seat_1778949580950" version="1.0">
                          <Label>111</Label>
                          <Orientation>backwards</Orientation>
                          <actualVehicleEquipments />
                          <SpotColumnRef ref="spot_column_1778936952743" version="1.0" />
                          <SpotRowRef ref="SpotRow/id/11" version="1.0" />
                          <IsByWindow>true</IsByWindow>
                          <Centroid>
                            <Location>
                              <pos>7.026602564102564 0.23</pos>
                            </Location>
                          </Centroid>
                          <Width>0.35</Width>
                          <Length>0.35</Length>
                        </PassengerSpot>
                        <PassengerSpot id="seat_1778949582596" version="1.0">
                          <Label>108</Label>
                          <Orientation>backwards</Orientation>
                          <actualVehicleEquipments />
                          <SpotColumnRef ref="SpotColumn/id/D" version="1.0" />
                          <SpotRowRef ref="spot_row_1778936985294" version="1.0" />
                          <Centroid>
                            <Location>
                              <pos>7.589102564102564 0.585</pos>
                            </Location>
                          </Centroid>
                          <Width>0.35</Width>
                          <Length>0.35</Length>
                        </PassengerSpot>
                        <PassengerSpot id="seat_1778949584068" version="1.0">
                          <Label>107</Label>
                          <Orientation>backwards</Orientation>
                          <actualVehicleEquipments />
                          <SpotColumnRef ref="spot_column_1778936952743" version="1.0" />
                          <SpotRowRef ref="spot_row_1778936985294" version="1.0" />
                          <IsByWindow>true</IsByWindow>
                          <Centroid>
                            <Location>
                              <pos>7.589102564102564 0.23</pos>
                            </Location>
                          </Centroid>
                          <Width>0.35</Width>
                          <Length>0.35</Length>
                        </PassengerSpot>
                        <PassengerSpot id="seat_1778949585628" version="1.0">
                          <Label>106</Label>
                          <Orientation>backwards</Orientation>
                          <actualVehicleEquipments />
                          <SpotColumnRef ref="SpotColumn/id/D" version="1.0" />
                          <SpotRowRef ref="spot_row_1778936986382" version="1.0" />
                          <Centroid>
                            <Location>
                              <pos>8.208333333333334 0.585</pos>
                            </Location>
                          </Centroid>
                          <Width>0.35</Width>
                          <Length>0.35</Length>
                        </PassengerSpot>
                        <PassengerSpot id="seat_1778949587269" version="1.0">
                          <Label>105</Label>
                          <Orientation>backwards</Orientation>
                          <actualVehicleEquipments />
                          <SpotColumnRef ref="spot_column_1778936952743" version="1.0" />
                          <SpotRowRef ref="spot_row_1778936986382" version="1.0" />
                          <IsByWindow>true</IsByWindow>
                          <Centroid>
                            <Location>
                              <pos>8.208333333333334 0.23</pos>
                            </Location>
                          </Centroid>
                          <Width>0.35</Width>
                          <Length>0.35</Length>
                        </PassengerSpot>
                        <PassengerSpot id="seat_1778949590102" version="1.0">
                          <Label>101</Label>
                          <Orientation>backwards</Orientation>
                          <actualVehicleEquipments />
                          <SpotColumnRef ref="spot_column_1778936952743" version="1.0" />
                          <SpotRowRef ref="spot_row_1778936986822" version="1.0" />
                          <IsByWindow>true</IsByWindow>
                          <Centroid>
                            <Location>
                              <pos>8.733333333333336 0.23</pos>
                            </Location>
                          </Centroid>
                          <Width>0.35</Width>
                          <Length>0.35</Length>
                        </PassengerSpot>
                        <PassengerSpot id="seat_1778949593284" version="1.0">
                          <Label>102</Label>
                          <Orientation>backwards</Orientation>
                          <actualVehicleEquipments />
                          <SpotColumnRef ref="SpotColumn/id/D" version="1.0" />
                          <SpotRowRef ref="spot_row_1778936986822" version="1.0" />
                          <Centroid>
                            <Location>
                              <pos>8.733333333333336 0.585</pos>
                            </Location>
                          </Centroid>
                          <Width>0.35</Width>
                          <Length>0.35</Length>
                        </PassengerSpot>
                        <PassengerSpot id="seat_1778949647845" version="1.0">
                          <Label>125</Label>
                          <Orientation>forwards</Orientation>
                          <actualVehicleEquipments />
                          <SpotColumnRef ref="SpotColumn/id/A" version="1.0" />
                          <SpotRowRef ref="SpotRow/id/7" version="1.0" />
                          <IsByWindow>true</IsByWindow>
                          <Centroid>
                            <Location>
                              <pos>5.058333333333334 1.775</pos>
                            </Location>
                          </Centroid>
                          <Width>0.35</Width>
                          <Length>0.35</Length>
                        </PassengerSpot>
                        <PassengerSpot id="seat_1778950383846" version="1.0">
                          <Label>124</Label>
                          <Orientation>forwards</Orientation>
                          <actualVehicleEquipments />
                          <SpotColumnRef ref="SpotColumn/id/D" version="1.0" />
                          <SpotRowRef ref="SpotRow/id/7" version="1.0" />
                          <Centroid>
                            <Location>
                              <pos>5.058333333333334 0.585</pos>
                            </Location>
                          </Centroid>
                          <Width>0.35</Width>
                          <Length>0.35</Length>
                        </PassengerSpot>
                        <PassengerSpot id="seat_1778950385629" version="1.0">
                          <Label>123</Label>
                          <Orientation>forwards</Orientation>
                          <actualVehicleEquipments />
                          <SpotColumnRef ref="spot_column_1778936952743" version="1.0" />
                          <SpotRowRef ref="SpotRow/id/7" version="1.0" />
                          <IsByWindow>true</IsByWindow>
                          <Centroid>
                            <Location>
                              <pos>5.058333333333334 0.23</pos>
                            </Location>
                          </Centroid>
                          <Width>0.35</Width>
                          <Length>0.35</Length>
                        </PassengerSpot>
                      </passengerSpots>
                      <luggageSpots />
                      <deckEntrances>
                        <PassengerEntrance id="entrance_1778950926855" version="1.0">
                          <actualVehicleEquipments />
                          <Centroid>
                            <Location>
                              <pos>0.3111111111111111 1.946667</pos>
                            </Location>
                          </Centroid>
                        </PassengerEntrance>
                        <PassengerEntrance id="entrance_1778950928595" version="1.0">
                          <actualVehicleEquipments />
                          <Centroid>
                            <Location>
                              <pos>12.2 1.977778</pos>
                            </Location>
                          </Centroid>
                        </PassengerEntrance>
                        <PassengerEntrance id="entrance_1778950938091" version="1.0">
                          <actualVehicleEquipments />
                          <Centroid>
                            <Location>
                              <pos>0.29111111111111115 0.037778</pos>
                            </Location>
                          </Centroid>
                        </PassengerEntrance>
                        <PassengerEntrance id="entrance_1778950940714" version="1.0">
                          <actualVehicleEquipments />
                          <Centroid>
                            <Location>
                              <pos>12.2 0.022222</pos>
                            </Location>
                          </Centroid>
                        </PassengerEntrance>
                      </deckEntrances>
                      <deckEntranceUsage />
                      <deckEntranceCouples />
                      <deckSpaceCapacities />
                      <actualVehicleEquipments />
                      <FareClass>Best</FareClass>
                    </PassengerSpace>
                    <PassengerSpace id="seating-area_1778951084721" version="1.0">
                      <Name>Lounge</Name>
                      <PassengerSpaceType>seatingArea</PassengerSpaceType>
                      <passengerSpots>
                        <PassengerSpot id="seat_1778949594749" version="1.0">
                          <Label>171</Label>
                          <Orientation>forwards</Orientation>
                          <actualVehicleEquipments />
                          <SpotColumnRef ref="spot_column_1778936952743" version="1.0" />
                          <SpotRowRef ref="spot_row_1778936987173" version="1.0" />
                          <IsByWindow>true</IsByWindow>
                          <Centroid>
                            <Location>
                              <pos>9.183333333333334 0.23</pos>
                            </Location>
                          </Centroid>
                          <Width>0.35</Width>
                          <Length>0.35</Length>
                        </PassengerSpot>
                        <PassengerSpot id="seat_1778949598573" version="1.0">
                          <Label>172</Label>
                          <Orientation>forwards</Orientation>
                          <actualVehicleEquipments />
                          <SpotColumnRef ref="SpotColumn/id/D" version="1.0" />
                          <SpotRowRef ref="spot_row_1778936987173" version="1.0" />
                          <Centroid>
                            <Location>
                              <pos>9.183333333333334 0.585</pos>
                            </Location>
                          </Centroid>
                          <Width>0.35</Width>
                          <Length>0.35</Length>
                        </PassengerSpot>
                        <PassengerSpot id="seat_1778949600084" version="1.0">
                          <Label>174</Label>
                          <Orientation>forwards</Orientation>
                          <actualVehicleEquipments />
                          <SpotColumnRef ref="SpotColumn/id/C" version="1.0" />
                          <SpotRowRef ref="spot_row_1778936987173" version="1.0" />
                          <Centroid>
                            <Location>
                              <pos>9.183333333333334 0.925</pos>
                            </Location>
                          </Centroid>
                          <Width>0.35</Width>
                          <Length>0.35</Length>
                        </PassengerSpot>
                        <PassengerSpot id="seat_1778949601637" version="1.0">
                          <Label>175</Label>
                          <Orientation>leftwards</Orientation>
                          <actualVehicleEquipments />
                          <SpotColumnRef ref="spot_column_1778936952743" version="1.0" />
                          <SpotRowRef ref="spot_row_1778936988038" version="1.0" />
                          <Centroid>
                            <Location>
                              <pos>9.795833333333336 0.23</pos>
                            </Location>
                          </Centroid>
                          <Width>0.35</Width>
                          <Length>0.35</Length>
                        </PassengerSpot>
                        <PassengerSpot id="seat_1778949608438" version="1.0">
                          <Label>176</Label>
                          <Orientation>leftwards</Orientation>
                          <actualVehicleEquipments />
                          <SpotColumnRef ref="spot_column_1778936952743" version="1.0" />
                          <SpotRowRef ref="spot_row_1778936988454" version="1.0" />
                          <Centroid>
                            <Location>
                              <pos>10.145833333333336 0.23</pos>
                            </Location>
                          </Centroid>
                          <Width>0.35</Width>
                          <Length>0.35</Length>
                        </PassengerSpot>
                        <PassengerSpot id="seat_1778949609925" version="1.0">
                          <Label>177</Label>
                          <Orientation>leftwards</Orientation>
                          <actualVehicleEquipments />
                          <SpotColumnRef ref="spot_column_1778936952743" version="1.0" />
                          <SpotRowRef ref="spot_row_1778936988839" version="1.0" />
                          <Centroid>
                            <Location>
                              <pos>10.570833333333335 0.23</pos>
                            </Location>
                          </Centroid>
                          <Width>0.35</Width>
                          <Length>0.35</Length>
                        </PassengerSpot>
                        <PassengerSpot id="seat_1778949613334" version="1.0">
                          <Label>178</Label>
                          <Orientation>leftwards</Orientation>
                          <actualVehicleEquipments />
                          <SpotColumnRef ref="spot_column_1778936952743" version="1.0" />
                          <SpotRowRef ref="spot_row_1778936989382" version="1.0" />
                          <Centroid>
                            <Location>
                              <pos>10.933333333333334 0.23</pos>
                            </Location>
                          </Centroid>
                          <Width>0.35</Width>
                          <Length>0.35</Length>
                        </PassengerSpot>
                        <PassengerSpot id="seat_1778949634064" version="1.0">
                          <Label>179</Label>
                          <Orientation>backwards</Orientation>
                          <actualVehicleEquipments />
                          <SpotColumnRef ref="spot_column_1778936952743" version="1.0" />
                          <SpotRowRef ref="spot_row_1778949629523" version="1.0" />
                          <IsByWindow>true</IsByWindow>
                          <Centroid>
                            <Location>
                              <pos>11.58 0.23</pos>
                            </Location>
                          </Centroid>
                          <Width>0.35</Width>
                          <Length>0.35</Length>
                        </PassengerSpot>
                        <PassengerSpot id="seat_1778949637141" version="1.0">
                          <Label>180</Label>
                          <Orientation>backwards</Orientation>
                          <actualVehicleEquipments />
                          <SpotColumnRef ref="SpotColumn/id/D" version="1.0" />
                          <SpotRowRef ref="spot_row_1778949629523" version="1.0" />
                          <Centroid>
                            <Location>
                              <pos>11.58 0.585</pos>
                            </Location>
                          </Centroid>
                          <Width>0.35</Width>
                          <Length>0.35</Length>
                        </PassengerSpot>
                        <PassengerSpot id="seat_1778949638877" version="1.0">
                          <Label>182</Label>
                          <Orientation>backwards</Orientation>
                          <actualVehicleEquipments />
                          <SpotColumnRef ref="SpotColumn/id/C" version="1.0" />
                          <SpotRowRef ref="spot_row_1778949629523" version="1.0" />
                          <Centroid>
                            <Location>
                              <pos>11.58 0.925</pos>
                            </Location>
                          </Centroid>
                          <Width>0.35</Width>
                          <Length>0.35</Length>
                        </PassengerSpot>
                        <PassengerSpot id="seat_1778949640598" version="1.0">
                          <Label>184</Label>
                          <Orientation>rightwards</Orientation>
                          <actualVehicleEquipments />
                          <SpotColumnRef ref="SpotColumn/id/C" version="1.0" />
                          <SpotRowRef ref="spot_row_1778936988454" version="1.0" />
                          <Centroid>
                            <Location>
                              <pos>10.703333333333337 0.925</pos>
                            </Location>
                          </Centroid>
                          <Width>0.35</Width>
                          <Length>0.35</Length>
                        </PassengerSpot>
                        <PassengerSpot id="seat_1778949646135" version="1.0">
                          <Label>183</Label>
                          <Orientation>rightwards</Orientation>
                          <actualVehicleEquipments />
                          <SpotColumnRef ref="SpotColumn/id/C" version="1.0" />
                          <SpotRowRef ref="spot_row_1778936988839" version="1.0" />
                          <Centroid>
                            <Location>
                              <pos>10.323333333333336 0.925</pos>
                            </Location>
                          </Centroid>
                          <Width>0.35</Width>
                          <Length>0.35</Length>
                        </PassengerSpot>
                      </passengerSpots>
                      <luggageSpots />
                      <deckEntrances />
                      <deckEntranceUsage />
                      <deckEntranceCouples />
                      <deckSpaceCapacities />
                      <actualVehicleEquipments />
                      <FareClass>Best</FareClass>
                    </PassengerSpace>
                  </deckSpaces>
                  <DeckLevelRef ref="deck_level_0" version="1.0" />
                  <Name />
                  <Width>2</Width>
                  <Length>13</Length>
                </Deck>
              </decks>
              <deckLevels>
                <DeckLevel id="deck_level_0" version="1.0">
                  <Label>Level 0</Label>
                </DeckLevel>
              </deckLevels>
            </DeckPlan>
          </deckPlans>
          <schematicMaps>
            <SchematicMap>
              <Name>Talent 3 seat map</Name>
              <ImageUri>https://www.example.com</ImageUri>
              <DepictedObjectRef ref="Train/id/1" />
            </SchematicMap>
          </schematicMaps>
        </ResourceFrame>
      </frames>
    </CompositeFrame>
  </dataObjects>
</PublicationDelivery>`})),qn,Jn=e((()=>{qn=`<?xml version="1.0" encoding="utf-8"?>
<PublicationDelivery version="1.2.2" schemaLocation="http://www.netex.org.uk/netex file:///home/robin/Projekte/NeTEx/xsd/NeTEx_publication.xsd">
  <PublicationTimestamp>2020-12-17T09:30:47.0Z</PublicationTimestamp>
  <ParticipantRef>SYS001</ParticipantRef>
  <dataObjects>
    <CompositeFrame version="any" id="CompositeFrame/id/1">
      <frames>
        <ResourceFrame version="any" id="ResourceFrame/id/1">
          <equipments>
            <AccessVehicleEquipment id="AccessVehicleEquipment/id/1" version="any">
              <Name>Ramp</Name>
              <Fixed>false</Fixed>
              <LowFloor>false</LowFloor>
              <HighFloor>false</HighFloor>
              <Ramp>true</Ramp>
            </AccessVehicleEquipment>
            <AccessVehicleEquipment id="AccessVehicleEquipment/id/2" version="any">
              <Name>Lift</Name>
              <Fixed>false</Fixed>
              <LowFloor>false</LowFloor>
              <HighFloor>false</HighFloor>
              <Ramp>false</Ramp>
            </AccessVehicleEquipment>
            <AccessVehicleEquipment id="AccessVehicleEquipment/id/3" version="any">
              <Name>Entrance dimensions</Name>
              <Fixed>false</Fixed>
              <LowFloor>false</LowFloor>
              <HighFloor>false</HighFloor>
              <Ramp>false</Ramp>
            </AccessVehicleEquipment>
          </equipments>
          <serviceFacilitySets>
            <ServiceFacilitySet version="any" id="ServiceFacilityTrain">
              <PassengerInformationFacilityList>nextStopIndicator

                stopAnnouncements</PassengerInformationFacilityList>
              <SanitaryFacilityList>toilet
                wheelchairAccessToilet</SanitaryFacilityList>
              <TicketingFacilityList />
            </ServiceFacilitySet>
            <ServiceFacilitySet version="any" id="ServiceFacilityQuiet">
              <NuisanceFacilityList>mobilePhoneFreeZone</NuisanceFacilityList>
            </ServiceFacilitySet>
          </serviceFacilitySets>
          <vehicleTypes>
            <Train version="any" id="Train/id/1">
              <Name>Talent 3</Name>
              <Description>4 Teiler</Description>
              <ReversingDirection>true</ReversingDirection>
              <SelfPropelled>true</SelfPropelled>
              <PropulsionType>electric</PropulsionType>
              <TransportMode>rail</TransportMode>
              <capacities>
                <PassengerCapacity version="any" id="PassengerCapacity/id/1">
                  <FareClass>firstClass</FareClass>
                  <SeatingCapacity>8</SeatingCapacity>
                </PassengerCapacity>
                <PassengerCapacity version="any" id="PassengerCapacity/id/2">
                  <FareClass>secondClass</FareClass>
                  <SeatingCapacity>207</SeatingCapacity>
                  <StandingCapacity>275</StandingCapacity>
                  <WheelchairPlaceCapacity>2</WheelchairPlaceCapacity>
                  <BicycleRackCapacity>33</BicycleRackCapacity>
                </PassengerCapacity>
              </capacities>
              <LowFloor>false</LowFloor>
              <HasLiftOrRamp>true</HasLiftOrRamp>
              <BoardingHeight>0.6</BoardingHeight>
              <Length>72.3</Length>
              <Width>2.926</Width>
              <Height>4.26</Height>
              <facilities>
                <ServiceFacilitySetRef version="any" ref="ServiceFacilityTrain" />
              </facilities>
              <components>
                <TrainComponent version="any" id="TrainComponent/id/1">
                  <Label>201-3</Label>
                  <TractiveElementTypeRef version="any" ref="TractiveElementType/id/T3-1" />
                  <OperationalOrientation>forwards</OperationalOrientation>
                  <ForwardCoupling>
                    <Splittable>true</Splittable>
                    <ThroughAccess>noThroughAccess</ThroughAccess>
                  </ForwardCoupling>
                </TrainComponent>
                <TrainComponent version="any" id="TrainComponent/id/2">
                  <Label>201-8</Label>
                  <TrailingElementTypeRef version="any" ref="TrailingElementType/id/M3-1" />
                  <OperationalOrientation>forwards</OperationalOrientation>
                  <ForwardCoupling>
                    <Splittable>true</Splittable>
                    <ThroughAccess>openEntrance</ThroughAccess>
                  </ForwardCoupling>
                </TrainComponent>
                <TrainComponent version="any" id="TrainComponent/id/3">
                  <Label>701-7</Label>
                  <TrailingElementTypeRef version="any" ref="TrailingElementType/id/M2-1" />
                  <OperationalOrientation>forwards</OperationalOrientation>
                  <ForwardCoupling>
                    <Splittable>true</Splittable>
                    <ThroughAccess>openEntrance</ThroughAccess>
                  </ForwardCoupling>
                </TrainComponent>
                <TrainComponent version="any" id="TrainComponent/id/4">
                  <Label>701-9</Label>
                  <TractiveElementTypeRef version="any" ref="TractiveElementType/id/T2-1" />
                  <OperationalOrientation>forwards</OperationalOrientation>
                  <ForwardCoupling>
                    <Splittable>true</Splittable>
                    <ThroughAccess>openEntrance</ThroughAccess>
                  </ForwardCoupling>
                </TrainComponent>
              </components>
            </Train>
          </vehicleTypes>
          <trainElementTypes>
            <TractiveElementType version="any" id="TractiveElementType/id/T3-1">
              <Name>T3-1</Name>
              <TrainElementType>engine</TrainElementType>
              <Length>20.05</Length>
              <Width>2.926</Width>
              <Height>4.26</Height>
              <DeckPlanRef version="any" ref="DeckPlan/id/1" />
            </TractiveElementType>
            <TractiveElementType version="any" id="TractiveElementType/id/T2-1">
              <Name>T2-1</Name>
              <TrainElementType>engine</TrainElementType>
              <Length>20.05</Length>
              <Width>2.926</Width>
              <Height>4.26</Height>
            </TractiveElementType>
            <TrailingElementType version="any" id="TrailingElementType/id/M3-1">
              <Name>M3-1</Name>
              <TrainElementType>carriage</TrainElementType>
              <Length>16.1</Length>
              <Width>2.926</Width>
              <Height>4.26</Height>
            </TrailingElementType>
            <TrailingElementType version="any" id="TrailingElementType/id/M2-1">
              <Name>M2-1</Name>
              <TrainElementType>carriage</TrainElementType>
              <Length>16.1</Length>
              <Width>2.926</Width>
              <Height>4.26</Height>
            </TrailingElementType>
          </trainElementTypes>
          <deckPlans>
            <DeckPlan id="DeckPlan/id/1" version="any">
              <xmlTagName />
              <decks>
                <Deck id="Deck/id/1" version="any">
                  <spotRows>
                    <SpotRow id="SpotRow/id/1" />
                    <SpotRow id="SpotRow/id/2" />
                    <SpotRow id="SpotRow/id/3" />
                    <SpotRow id="SpotRow/id/4" />
                    <SpotRow id="SpotRow/id/5" />
                    <SpotRow id="SpotRow/id/6" />
                    <SpotRow id="SpotRow/id/7" />
                    <SpotRow id="SpotRow/id/8" />
                    <SpotRow id="SpotRow/id/9" />
                    <SpotRow id="SpotRow/id/10" />
                    <SpotRow id="SpotRow/id/11" />
                    <SpotRow id="spot_row_1778936985294" />
                    <SpotRow id="spot_row_1778936986382" />
                    <SpotRow id="spot_row_1778936986822" />
                    <SpotRow id="spot_row_1778936987173" />
                    <SpotRow id="spot_row_1778936987614" />
                    <SpotRow id="spot_row_1778936988038" />
                    <SpotRow id="spot_row_1778936988454" />
                    <SpotRow id="spot_row_1778936988839" />
                  </spotRows>
                  <spotColumns>
                    <SpotColumn id="SpotColumn/id/A" />
                    <SpotColumn id="SpotColumn/id/B" />
                    <SpotColumn id="SpotColumn/id/C" />
                    <SpotColumn id="SpotColumn/id/D" />
                    <SpotColumn id="spot_column_1778936952743" />
                  </spotColumns>
                  <deckSpaces>
                    <PassengerSpace id="space_1778949529557" version="1.0">
                      <Name>Main Space</Name>
                      <SmokingAllowed>false</SmokingAllowed>
                      <StandingAllowed>true</StandingAllowed>
                      <PassengerSpaceType>seatingArea</PassengerSpaceType>
                      <passengerSpots>
                        <PassengerSpot id="seat_1778951280027" version="1.0">
                          <Label>6</Label>
                          <Orientation>forwards</Orientation>
                          <actualVehicleEquipments />
                          <SpotColumnRef ref="SpotColumn/id/D" version="1.0" />
                          <SpotRowRef ref="SpotRow/id/1" version="1.0" />
                          <Centroid>
                            <Location>
                              <pos>1.575 1.388462</pos>
                            </Location>
                          </Centroid>
                          <Width>0.35</Width>
                          <Length>0.35</Length>
                        </PassengerSpot>
                        <PassengerSpot id="seat_1778951281998" version="1.0">
                          <Label>5</Label>
                          <Orientation>forwards</Orientation>
                          <actualVehicleEquipments />
                          <SpotColumnRef ref="spot_column_1778936952743" version="1.0" />
                          <SpotRowRef ref="SpotRow/id/1" version="1.0" />
                          <IsByWindow>true</IsByWindow>
                          <Centroid>
                            <Location>
                              <pos>1.575 1.757692</pos>
                            </Location>
                          </Centroid>
                          <Width>0.35</Width>
                          <Length>0.35</Length>
                        </PassengerSpot>
                        <PassengerSpot id="seat_1778951283438" version="1.0">
                          <Label>1</Label>
                          <Orientation>forwards</Orientation>
                          <actualVehicleEquipments />
                          <SpotColumnRef ref="SpotColumn/id/A" version="1.0" />
                          <SpotRowRef ref="SpotRow/id/1" version="1.0" />
                          <IsByWindow>true</IsByWindow>
                          <Centroid>
                            <Location>
                              <pos>1.575 0.251923</pos>
                            </Location>
                          </Centroid>
                          <Width>0.35</Width>
                          <Length>0.35</Length>
                        </PassengerSpot>
                        <PassengerSpot id="seat_1778951286374" version="1.0">
                          <Label>2</Label>
                          <Orientation>forwards</Orientation>
                          <actualVehicleEquipments />
                          <SpotColumnRef ref="SpotColumn/id/B" version="1.0" />
                          <SpotRowRef ref="SpotRow/id/1" version="1.0" />
                          <Centroid>
                            <Location>
                              <pos>1.575 0.621154</pos>
                            </Location>
                          </Centroid>
                          <Width>0.35</Width>
                          <Length>0.35</Length>
                        </PassengerSpot>
                        <PassengerSpot id="seat_1778951288031" version="1.0">
                          <Label>9</Label>
                          <Orientation>forwards</Orientation>
                          <actualVehicleEquipments />
                          <SpotColumnRef ref="SpotColumn/id/A" version="1.0" />
                          <SpotRowRef ref="SpotRow/id/3" version="1.0" />
                          <IsByWindow>true</IsByWindow>
                          <Centroid>
                            <Location>
                              <pos>2.7134615384615377 0.251923</pos>
                            </Location>
                          </Centroid>
                          <Width>0.35</Width>
                          <Length>0.35</Length>
                        </PassengerSpot>
                        <PassengerSpot id="seat_1778951289444" version="1.0">
                          <Label>10</Label>
                          <Orientation>forwards</Orientation>
                          <actualVehicleEquipments />
                          <SpotColumnRef ref="SpotColumn/id/B" version="1.0" />
                          <SpotRowRef ref="SpotRow/id/3" version="1.0" />
                          <Centroid>
                            <Location>
                              <pos>2.7134615384615377 0.621154</pos>
                            </Location>
                          </Centroid>
                          <Width>0.35</Width>
                          <Length>0.35</Length>
                        </PassengerSpot>
                        <PassengerSpot id="seat_1778951290773" version="1.0">
                          <Label>14</Label>
                          <Orientation>forwards</Orientation>
                          <actualVehicleEquipments />
                          <SpotColumnRef ref="SpotColumn/id/D" version="1.0" />
                          <SpotRowRef ref="SpotRow/id/3" version="1.0" />
                          <Centroid>
                            <Location>
                              <pos>2.7134615384615377 1.388462</pos>
                            </Location>
                          </Centroid>
                          <Width>0.35</Width>
                          <Length>0.35</Length>
                        </PassengerSpot>
                        <PassengerSpot id="seat_1778951292301" version="1.0">
                          <Label>13</Label>
                          <Orientation>forwards</Orientation>
                          <actualVehicleEquipments />
                          <SpotColumnRef ref="spot_column_1778936952743" version="1.0" />
                          <SpotRowRef ref="SpotRow/id/3" version="1.0" />
                          <IsByWindow>true</IsByWindow>
                          <Centroid>
                            <Location>
                              <pos>2.713461538461538 1.757692</pos>
                            </Location>
                          </Centroid>
                          <Width>0.35</Width>
                          <Length>0.35</Length>
                        </PassengerSpot>
                        <PassengerSpot id="seat_1778951293892" version="1.0">
                          <Label>17</Label>
                          <Orientation>forwards</Orientation>
                          <actualVehicleEquipments />
                          <SpotColumnRef ref="SpotColumn/id/A" version="1.0" />
                          <SpotRowRef ref="SpotRow/id/5" version="1.0" />
                          <IsByWindow>true</IsByWindow>
                          <Centroid>
                            <Location>
                              <pos>3.944230769230769 0.251923</pos>
                            </Location>
                          </Centroid>
                          <Width>0.35</Width>
                          <Length>0.35</Length>
                        </PassengerSpot>
                        <PassengerSpot id="seat_1778951296045" version="1.0">
                          <Label>18</Label>
                          <Orientation>forwards</Orientation>
                          <actualVehicleEquipments />
                          <SpotColumnRef ref="SpotColumn/id/B" version="1.0" />
                          <SpotRowRef ref="SpotRow/id/5" version="1.0" />
                          <Centroid>
                            <Location>
                              <pos>3.944230769230769 0.621154</pos>
                            </Location>
                          </Centroid>
                          <Width>0.35</Width>
                          <Length>0.35</Length>
                        </PassengerSpot>
                        <PassengerSpot id="seat_1778951297870" version="1.0">
                          <Label>22</Label>
                          <Orientation>forwards</Orientation>
                          <actualVehicleEquipments />
                          <SpotColumnRef ref="SpotColumn/id/D" version="1.0" />
                          <SpotRowRef ref="SpotRow/id/5" version="1.0" />
                          <Centroid>
                            <Location>
                              <pos>3.944230769230769 1.388462</pos>
                            </Location>
                          </Centroid>
                          <Width>0.35</Width>
                          <Length>0.35</Length>
                        </PassengerSpot>
                        <PassengerSpot id="seat_1778951299357" version="1.0">
                          <Label>21</Label>
                          <Orientation>forwards</Orientation>
                          <actualVehicleEquipments />
                          <SpotColumnRef ref="spot_column_1778936952743" version="1.0" />
                          <SpotRowRef ref="SpotRow/id/5" version="1.0" />
                          <IsByWindow>true</IsByWindow>
                          <Centroid>
                            <Location>
                              <pos>3.944230769230769 1.757692</pos>
                            </Location>
                          </Centroid>
                          <Width>0.35</Width>
                          <Length>0.35</Length>
                        </PassengerSpot>
                        <PassengerSpot id="seat_1778951300693" version="1.0">
                          <Label>25</Label>
                          <Orientation>forwards</Orientation>
                          <actualVehicleEquipments />
                          <SpotColumnRef ref="SpotColumn/id/A" version="1.0" />
                          <SpotRowRef ref="SpotRow/id/7" version="1.0" />
                          <IsByWindow>true</IsByWindow>
                          <Centroid>
                            <Location>
                              <pos>5.128846153846154 0.251923</pos>
                            </Location>
                          </Centroid>
                          <Width>0.35</Width>
                          <Length>0.35</Length>
                        </PassengerSpot>
                        <PassengerSpot id="seat_1778951303023" version="1.0">
                          <Label>26</Label>
                          <Orientation>forwards</Orientation>
                          <actualVehicleEquipments />
                          <SpotColumnRef ref="SpotColumn/id/B" version="1.0" />
                          <SpotRowRef ref="SpotRow/id/7" version="1.0" />
                          <Centroid>
                            <Location>
                              <pos>5.128846153846154 0.621154</pos>
                            </Location>
                          </Centroid>
                          <Width>0.35</Width>
                          <Length>0.35</Length>
                        </PassengerSpot>
                        <PassengerSpot id="seat_1778951304677" version="1.0">
                          <Label>30</Label>
                          <Orientation>forwards</Orientation>
                          <actualVehicleEquipments />
                          <SpotColumnRef ref="SpotColumn/id/D" version="1.0" />
                          <SpotRowRef ref="SpotRow/id/7" version="1.0" />
                          <IsByWindow>true</IsByWindow>
                          <Centroid>
                            <Location>
                              <pos>5.128846153846154 1.757692</pos>
                            </Location>
                          </Centroid>
                          <Width>0.35</Width>
                          <Length>0.35</Length>
                        </PassengerSpot>
                        <PassengerSpot id="seat_1778951308374" version="1.0">
                          <Label>29</Label>
                          <Orientation>forwards</Orientation>
                          <actualVehicleEquipments />
                          <SpotColumnRef ref="spot_column_1778936952743" version="1.0" />
                          <SpotRowRef ref="SpotRow/id/7" version="1.0" />
                          <Centroid>
                            <Location>
                              <pos>5.128846153846154 1.388462</pos>
                            </Location>
                          </Centroid>
                          <Width>0.35</Width>
                          <Length>0.35</Length>
                        </PassengerSpot>
                        <PassengerSpot id="seat_1778951311126" version="1.0">
                          <Label>33</Label>
                          <Orientation>forwards</Orientation>
                          <actualVehicleEquipments />
                          <SpotColumnRef ref="SpotColumn/id/A" version="1.0" />
                          <SpotRowRef ref="SpotRow/id/9" version="1.0" />
                          <IsByWindow>true</IsByWindow>
                          <Centroid>
                            <Location>
                              <pos>6.328846153846153 0.251923</pos>
                            </Location>
                          </Centroid>
                          <Width>0.35</Width>
                          <Length>0.35</Length>
                        </PassengerSpot>
                        <PassengerSpot id="seat_1778951313431" version="1.0">
                          <Label>34</Label>
                          <Orientation>forwards</Orientation>
                          <actualVehicleEquipments />
                          <SpotColumnRef ref="SpotColumn/id/B" version="1.0" />
                          <SpotRowRef ref="SpotRow/id/9" version="1.0" />
                          <Centroid>
                            <Location>
                              <pos>6.328846153846153 0.621154</pos>
                            </Location>
                          </Centroid>
                          <Width>0.35</Width>
                          <Length>0.35</Length>
                        </PassengerSpot>
                        <PassengerSpot id="seat_1778951315068" version="1.0">
                          <Label>38</Label>
                          <Orientation>forwards</Orientation>
                          <actualVehicleEquipments />
                          <SpotColumnRef ref="SpotColumn/id/D" version="1.0" />
                          <SpotRowRef ref="SpotRow/id/9" version="1.0" />
                          <Centroid>
                            <Location>
                              <pos>6.328846153846153 1.388462</pos>
                            </Location>
                          </Centroid>
                          <Width>0.35</Width>
                          <Length>0.35</Length>
                        </PassengerSpot>
                        <PassengerSpot id="seat_1778951318109" version="1.0">
                          <Label>37</Label>
                          <Orientation>forwards</Orientation>
                          <actualVehicleEquipments />
                          <SpotColumnRef ref="spot_column_1778936952743" version="1.0" />
                          <SpotRowRef ref="SpotRow/id/9" version="1.0" />
                          <IsByWindow>true</IsByWindow>
                          <Centroid>
                            <Location>
                              <pos>6.328846153846153 1.757692</pos>
                            </Location>
                          </Centroid>
                          <Width>0.35</Width>
                          <Length>0.35</Length>
                        </PassengerSpot>
                        <PassengerSpot id="seat_1778951319565" version="1.0">
                          <Label>41</Label>
                          <Orientation>forwards</Orientation>
                          <actualVehicleEquipments />
                          <SpotColumnRef ref="SpotColumn/id/A" version="1.0" />
                          <SpotRowRef ref="SpotRow/id/11" version="1.0" />
                          <IsByWindow>true</IsByWindow>
                          <Centroid>
                            <Location>
                              <pos>7.544230769230768 0.251923</pos>
                            </Location>
                          </Centroid>
                          <Width>0.35</Width>
                          <Length>0.35</Length>
                        </PassengerSpot>
                        <PassengerSpot id="seat_1778951326823" version="1.0">
                          <Label>42</Label>
                          <Orientation>forwards</Orientation>
                          <actualVehicleEquipments />
                          <SpotColumnRef ref="SpotColumn/id/B" version="1.0" />
                          <SpotRowRef ref="SpotRow/id/11" version="1.0" />
                          <Centroid>
                            <Location>
                              <pos>7.544230769230768 0.621154</pos>
                            </Location>
                          </Centroid>
                          <Width>0.35</Width>
                          <Length>0.35</Length>
                        </PassengerSpot>
                        <PassengerSpot id="seat_1778951329037" version="1.0">
                          <Label>49</Label>
                          <Orientation>forwards</Orientation>
                          <actualVehicleEquipments />
                          <SpotColumnRef ref="SpotColumn/id/A" version="1.0" />
                          <SpotRowRef ref="spot_row_1778936986382" version="1.0" />
                          <IsByWindow>true</IsByWindow>
                          <Centroid>
                            <Location>
                              <pos>8.682692307692315 0.251923</pos>
                            </Location>
                          </Centroid>
                          <Width>0.35</Width>
                          <Length>0.35</Length>
                        </PassengerSpot>
                        <PassengerSpot id="seat_1778951330999" version="1.0">
                          <Label>50</Label>
                          <Orientation>forwards</Orientation>
                          <actualVehicleEquipments />
                          <SpotColumnRef ref="SpotColumn/id/B" version="1.0" />
                          <SpotRowRef ref="spot_row_1778936986382" version="1.0" />
                          <Centroid>
                            <Location>
                              <pos>8.682692307692312 0.621154</pos>
                            </Location>
                          </Centroid>
                          <Width>0.35</Width>
                          <Length>0.35</Length>
                        </PassengerSpot>
                        <PassengerSpot id="seat_1778951332398" version="1.0">
                          <Label>57</Label>
                          <Orientation>forwards</Orientation>
                          <actualVehicleEquipments />
                          <SpotColumnRef ref="SpotColumn/id/A" version="1.0" />
                          <SpotRowRef ref="spot_row_1778936987173" version="1.0" />
                          <Centroid>
                            <Location>
                              <pos>9.821153846153848 0.251923</pos>
                            </Location>
                          </Centroid>
                          <Width>0.35</Width>
                          <Length>0.35</Length>
                        </PassengerSpot>
                        <PassengerSpot id="seat_1778951334357" version="1.0">
                          <Label>58</Label>
                          <Orientation>forwards</Orientation>
                          <actualVehicleEquipments />
                          <SpotColumnRef ref="SpotColumn/id/B" version="1.0" />
                          <SpotRowRef ref="spot_row_1778936987173" version="1.0" />
                          <Centroid>
                            <Location>
                              <pos>9.821153846153848 0.621154</pos>
                            </Location>
                          </Centroid>
                          <Width>0.35</Width>
                          <Length>0.35</Length>
                        </PassengerSpot>
                        <PassengerSpot id="seat_1778951335649" version="1.0">
                          <Label>65</Label>
                          <Orientation>forwards</Orientation>
                          <actualVehicleEquipments />
                          <SpotColumnRef ref="SpotColumn/id/A" version="1.0" />
                          <SpotRowRef ref="spot_row_1778936988038" version="1.0" />
                          <IsByWindow>true</IsByWindow>
                          <Centroid>
                            <Location>
                              <pos>10.913461538461545 0.251923</pos>
                            </Location>
                          </Centroid>
                          <Width>0.35</Width>
                          <Length>0.35</Length>
                        </PassengerSpot>
                        <PassengerSpot id="seat_1778951337629" version="1.0">
                          <Label>66</Label>
                          <Orientation>forwards</Orientation>
                          <actualVehicleEquipments />
                          <SpotColumnRef ref="SpotColumn/id/B" version="1.0" />
                          <SpotRowRef ref="spot_row_1778936988038" version="1.0" />
                          <Centroid>
                            <Location>
                              <pos>10.913461538461545 0.621154</pos>
                            </Location>
                          </Centroid>
                          <Width>0.35</Width>
                          <Length>0.35</Length>
                        </PassengerSpot>
                        <PassengerSpot id="seat_1778951339093" version="1.0">
                          <Label>70</Label>
                          <Orientation>forwards</Orientation>
                          <actualVehicleEquipments />
                          <SpotColumnRef ref="SpotColumn/id/D" version="1.0" />
                          <SpotRowRef ref="spot_row_1778936988038" version="1.0" />
                          <Centroid>
                            <Location>
                              <pos>10.913461538461545 1.388462</pos>
                            </Location>
                          </Centroid>
                          <Width>0.35</Width>
                          <Length>0.35</Length>
                        </PassengerSpot>
                        <PassengerSpot id="seat_1778951341134" version="1.0">
                          <Label>69</Label>
                          <Orientation>forwards</Orientation>
                          <actualVehicleEquipments />
                          <SpotColumnRef ref="spot_column_1778936952743" version="1.0" />
                          <SpotRowRef ref="spot_row_1778936988038" version="1.0" />
                          <IsByWindow>true</IsByWindow>
                          <Centroid>
                            <Location>
                              <pos>10.913461538461544 1.757692</pos>
                            </Location>
                          </Centroid>
                          <Width>0.35</Width>
                          <Length>0.35</Length>
                        </PassengerSpot>
                        <PassengerSpot id="seat_1778951342589" version="1.0">
                          <Label>62</Label>
                          <Orientation>forwards</Orientation>
                          <actualVehicleEquipments />
                          <SpotColumnRef ref="SpotColumn/id/D" version="1.0" />
                          <SpotRowRef ref="spot_row_1778936987173" version="1.0" />
                          <IsByWindow>true</IsByWindow>
                          <Centroid>
                            <Location>
                              <pos>9.821153846153848 1.757692</pos>
                            </Location>
                          </Centroid>
                          <Width>0.35</Width>
                          <Length>0.35</Length>
                        </PassengerSpot>
                        <PassengerSpot id="seat_1778951344453" version="1.0">
                          <Label>61</Label>
                          <Orientation>forwards</Orientation>
                          <actualVehicleEquipments />
                          <SpotColumnRef ref="spot_column_1778936952743" version="1.0" />
                          <SpotRowRef ref="spot_row_1778936987173" version="1.0" />
                          <Centroid>
                            <Location>
                              <pos>9.821153846153848 1.388462</pos>
                            </Location>
                          </Centroid>
                          <Width>0.35</Width>
                          <Length>0.35</Length>
                        </PassengerSpot>
                        <PassengerSpot id="seat_1778951345862" version="1.0">
                          <Label>54</Label>
                          <Orientation>forwards</Orientation>
                          <actualVehicleEquipments />
                          <SpotColumnRef ref="SpotColumn/id/D" version="1.0" />
                          <SpotRowRef ref="spot_row_1778936986382" version="1.0" />
                          <IsByWindow>true</IsByWindow>
                          <Centroid>
                            <Location>
                              <pos>8.682692307692312 1.757692</pos>
                            </Location>
                          </Centroid>
                          <Width>0.35</Width>
                          <Length>0.35</Length>
                        </PassengerSpot>
                        <PassengerSpot id="seat_1778951347582" version="1.0">
                          <Label>53</Label>
                          <Orientation>forwards</Orientation>
                          <actualVehicleEquipments />
                          <SpotColumnRef ref="spot_column_1778936952743" version="1.0" />
                          <SpotRowRef ref="spot_row_1778936986382" version="1.0" />
                          <Centroid>
                            <Location>
                              <pos>8.682692307692314 1.388462</pos>
                            </Location>
                          </Centroid>
                          <Width>0.35</Width>
                          <Length>0.35</Length>
                        </PassengerSpot>
                        <PassengerSpot id="seat_1778951349037" version="1.0">
                          <Label>46</Label>
                          <Orientation>forwards</Orientation>
                          <actualVehicleEquipments />
                          <SpotColumnRef ref="SpotColumn/id/D" version="1.0" />
                          <SpotRowRef ref="SpotRow/id/11" version="1.0" />
                          <IsByWindow>true</IsByWindow>
                          <Centroid>
                            <Location>
                              <pos>7.544230769230768 1.757692</pos>
                            </Location>
                          </Centroid>
                          <Width>0.35</Width>
                          <Length>0.35</Length>
                        </PassengerSpot>
                        <PassengerSpot id="seat_1778951350702" version="1.0">
                          <Label>45</Label>
                          <Orientation>forwards</Orientation>
                          <actualVehicleEquipments />
                          <SpotColumnRef ref="spot_column_1778936952743" version="1.0" />
                          <SpotRowRef ref="SpotRow/id/11" version="1.0" />
                          <Centroid>
                            <Location>
                              <pos>7.544230769230768 1.388462</pos>
                            </Location>
                          </Centroid>
                          <Width>0.35</Width>
                          <Length>0.35</Length>
                        </PassengerSpot>
                        <PassengerSpot id="seat_1778951760950" version="1.0">
                          <Label>3</Label>
                          <Orientation>backwards</Orientation>
                          <actualVehicleEquipments />
                          <SpotColumnRef ref="SpotColumn/id/A" version="1.0" />
                          <SpotRowRef ref="SpotRow/id/2" version="1.0" />
                          <IsByWindow>true</IsByWindow>
                          <Centroid>
                            <Location>
                              <pos>2.3442307692307667 0.251923</pos>
                            </Location>
                          </Centroid>
                          <Width>0.35</Width>
                          <Length>0.35</Length>
                        </PassengerSpot>
                        <PassengerSpot id="seat_1778951765210" version="1.0">
                          <Label>4</Label>
                          <Orientation>backwards</Orientation>
                          <actualVehicleEquipments />
                          <SpotColumnRef ref="SpotColumn/id/B" version="1.0" />
                          <SpotRowRef ref="SpotRow/id/2" version="1.0" />
                          <Centroid>
                            <Location>
                              <pos>2.3442307692307676 0.621154</pos>
                            </Location>
                          </Centroid>
                          <Width>0.35</Width>
                          <Length>0.35</Length>
                        </PassengerSpot>
                        <PassengerSpot id="seat_1778951766953" version="1.0">
                          <Label>8</Label>
                          <Orientation>backwards</Orientation>
                          <actualVehicleEquipments />
                          <SpotColumnRef ref="SpotColumn/id/D" version="1.0" />
                          <SpotRowRef ref="SpotRow/id/2" version="1.0" />
                          <Centroid>
                            <Location>
                              <pos>2.3442307692307676 1.388462</pos>
                            </Location>
                          </Centroid>
                          <Width>0.35</Width>
                          <Length>0.35</Length>
                        </PassengerSpot>
                        <PassengerSpot id="seat_1778951768609" version="1.0">
                          <Label>7</Label>
                          <Orientation>backwards</Orientation>
                          <actualVehicleEquipments />
                          <SpotColumnRef ref="spot_column_1778936952743" version="1.0" />
                          <SpotRowRef ref="SpotRow/id/2" version="1.0" />
                          <IsByWindow>true</IsByWindow>
                          <Centroid>
                            <Location>
                              <pos>2.344230769230767 1.757692</pos>
                            </Location>
                          </Centroid>
                          <Width>0.35</Width>
                          <Length>0.35</Length>
                        </PassengerSpot>
                        <PassengerSpot id="seat_1778951770217" version="1.0">
                          <Label>11</Label>
                          <Orientation>backwards</Orientation>
                          <actualVehicleEquipments />
                          <SpotColumnRef ref="SpotColumn/id/A" version="1.0" />
                          <SpotRowRef ref="SpotRow/id/4" version="1.0" />
                          <IsByWindow>true</IsByWindow>
                          <Centroid>
                            <Location>
                              <pos>3.5749999999999997 0.251923</pos>
                            </Location>
                          </Centroid>
                          <Width>0.35</Width>
                          <Length>0.35</Length>
                        </PassengerSpot>
                        <PassengerSpot id="seat_1778951771856" version="1.0">
                          <Label>12</Label>
                          <Orientation>backwards</Orientation>
                          <actualVehicleEquipments />
                          <SpotColumnRef ref="SpotColumn/id/B" version="1.0" />
                          <SpotRowRef ref="SpotRow/id/4" version="1.0" />
                          <Centroid>
                            <Location>
                              <pos>3.5749999999999997 0.621154</pos>
                            </Location>
                          </Centroid>
                          <Width>0.35</Width>
                          <Length>0.35</Length>
                        </PassengerSpot>
                        <PassengerSpot id="seat_1778951773553" version="1.0">
                          <Label>19</Label>
                          <Orientation>backwards</Orientation>
                          <actualVehicleEquipments />
                          <SpotColumnRef ref="SpotColumn/id/A" version="1.0" />
                          <SpotRowRef ref="SpotRow/id/6" version="1.0" />
                          <Centroid>
                            <Location>
                              <pos>3.5749999999999997 1.388462</pos>
                            </Location>
                          </Centroid>
                          <Width>0.35</Width>
                          <Length>0.35</Length>
                        </PassengerSpot>
                        <PassengerSpot id="seat_1778951775312" version="1.0">
                          <Label>20</Label>
                          <Orientation>backwards</Orientation>
                          <actualVehicleEquipments />
                          <SpotColumnRef ref="SpotColumn/id/B" version="1.0" />
                          <SpotRowRef ref="SpotRow/id/6" version="1.0" />
                          <IsByWindow>true</IsByWindow>
                          <Centroid>
                            <Location>
                              <pos>3.5749999999999997 1.757692</pos>
                            </Location>
                          </Centroid>
                          <Width>0.35</Width>
                          <Length>0.35</Length>
                        </PassengerSpot>
                        <PassengerSpot id="seat_1778951776978" version="1.0">
                          <Label>16</Label>
                          <Orientation>backwards</Orientation>
                          <actualVehicleEquipments />
                          <SpotColumnRef ref="SpotColumn/id/D" version="1.0" />
                          <SpotRowRef ref="SpotRow/id/4" version="1.0" />
                          <Centroid>
                            <Location>
                              <pos>4.759615384615384 0.621154</pos>
                            </Location>
                          </Centroid>
                          <Width>0.35</Width>
                          <Length>0.35</Length>
                        </PassengerSpot>
                        <PassengerSpot id="seat_1778951778465" version="1.0">
                          <Label>15</Label>
                          <Orientation>backwards</Orientation>
                          <actualVehicleEquipments />
                          <SpotColumnRef ref="spot_column_1778936952743" version="1.0" />
                          <SpotRowRef ref="SpotRow/id/4" version="1.0" />
                          <IsByWindow>true</IsByWindow>
                          <Centroid>
                            <Location>
                              <pos>4.759615384615384 0.251923</pos>
                            </Location>
                          </Centroid>
                          <Width>0.35</Width>
                          <Length>0.35</Length>
                        </PassengerSpot>
                        <PassengerSpot id="seat_1778951779768" version="1.0">
                          <Label>24</Label>
                          <Orientation>backwards</Orientation>
                          <actualVehicleEquipments />
                          <SpotColumnRef ref="SpotColumn/id/D" version="1.0" />
                          <SpotRowRef ref="SpotRow/id/6" version="1.0" />
                          <Centroid>
                            <Location>
                              <pos>4.759615384615384 1.388462</pos>
                            </Location>
                          </Centroid>
                          <Width>0.35</Width>
                          <Length>0.35</Length>
                        </PassengerSpot>
                        <PassengerSpot id="seat_1778951781537" version="1.0">
                          <Label>23</Label>
                          <Orientation>backwards</Orientation>
                          <actualVehicleEquipments />
                          <SpotColumnRef ref="spot_column_1778936952743" version="1.0" />
                          <SpotRowRef ref="SpotRow/id/6" version="1.0" />
                          <IsByWindow>true</IsByWindow>
                          <Centroid>
                            <Location>
                              <pos>4.759615384615384 1.757692</pos>
                            </Location>
                          </Centroid>
                          <Width>0.35</Width>
                          <Length>0.35</Length>
                        </PassengerSpot>
                        <PassengerSpot id="seat_1778951783249" version="1.0">
                          <Label>27</Label>
                          <Orientation>backwards</Orientation>
                          <actualVehicleEquipments />
                          <SpotColumnRef ref="SpotColumn/id/A" version="1.0" />
                          <SpotRowRef ref="SpotRow/id/8" version="1.0" />
                          <IsByWindow>true</IsByWindow>
                          <Centroid>
                            <Location>
                              <pos>5.944230769230765 0.251923</pos>
                            </Location>
                          </Centroid>
                          <Width>0.35</Width>
                          <Length>0.35</Length>
                        </PassengerSpot>
                        <PassengerSpot id="seat_1778951785616" version="1.0">
                          <Label>28</Label>
                          <Orientation>backwards</Orientation>
                          <actualVehicleEquipments />
                          <SpotColumnRef ref="SpotColumn/id/B" version="1.0" />
                          <SpotRowRef ref="SpotRow/id/8" version="1.0" />
                          <Centroid>
                            <Location>
                              <pos>5.944230769230766 0.621154</pos>
                            </Location>
                          </Centroid>
                          <Width>0.35</Width>
                          <Length>0.35</Length>
                        </PassengerSpot>
                        <PassengerSpot id="seat_1778951786953" version="1.0">
                          <Label>32</Label>
                          <Orientation>backwards</Orientation>
                          <actualVehicleEquipments />
                          <SpotColumnRef ref="SpotColumn/id/D" version="1.0" />
                          <SpotRowRef ref="SpotRow/id/8" version="1.0" />
                          <Centroid>
                            <Location>
                              <pos>5.944230769230766 1.388462</pos>
                            </Location>
                          </Centroid>
                          <Width>0.35</Width>
                          <Length>0.35</Length>
                        </PassengerSpot>
                        <PassengerSpot id="seat_1778951788225" version="1.0">
                          <Label>31</Label>
                          <Orientation>backwards</Orientation>
                          <actualVehicleEquipments />
                          <SpotColumnRef ref="spot_column_1778936952743" version="1.0" />
                          <SpotRowRef ref="SpotRow/id/8" version="1.0" />
                          <IsByWindow>true</IsByWindow>
                          <Centroid>
                            <Location>
                              <pos>5.944230769230765 1.757692</pos>
                            </Location>
                          </Centroid>
                          <Width>0.35</Width>
                          <Length>0.35</Length>
                        </PassengerSpot>
                        <PassengerSpot id="seat_1778951789681" version="1.0">
                          <Label>35</Label>
                          <Orientation>backwards</Orientation>
                          <actualVehicleEquipments />
                          <SpotColumnRef ref="SpotColumn/id/A" version="1.0" />
                          <SpotRowRef ref="SpotRow/id/10" version="1.0" />
                          <IsByWindow>true</IsByWindow>
                          <Centroid>
                            <Location>
                              <pos>7.174999999999999 0.251923</pos>
                            </Location>
                          </Centroid>
                          <Width>0.35</Width>
                          <Length>0.35</Length>
                        </PassengerSpot>
                        <PassengerSpot id="seat_1778951791424" version="1.0">
                          <Label>43</Label>
                          <Orientation>backwards</Orientation>
                          <actualVehicleEquipments />
                          <SpotColumnRef ref="SpotColumn/id/A" version="1.0" />
                          <SpotRowRef ref="spot_row_1778936985294" version="1.0" />
                          <Centroid>
                            <Location>
                              <pos>8.313461538461542 0.621154</pos>
                            </Location>
                          </Centroid>
                          <Width>0.35</Width>
                          <Length>0.35</Length>
                        </PassengerSpot>
                        <PassengerSpot id="seat_1778951792713" version="1.0">
                          <Label>36</Label>
                          <Orientation>backwards</Orientation>
                          <actualVehicleEquipments />
                          <SpotColumnRef ref="SpotColumn/id/B" version="1.0" />
                          <SpotRowRef ref="SpotRow/id/10" version="1.0" />
                          <Centroid>
                            <Location>
                              <pos>7.174999999999999 0.621154</pos>
                            </Location>
                          </Centroid>
                          <Width>0.35</Width>
                          <Length>0.35</Length>
                        </PassengerSpot>
                        <PassengerSpot id="seat_1778951794097" version="1.0">
                          <Label>40</Label>
                          <Orientation>backwards</Orientation>
                          <actualVehicleEquipments />
                          <SpotColumnRef ref="SpotColumn/id/D" version="1.0" />
                          <SpotRowRef ref="SpotRow/id/10" version="1.0" />
                          <IsByWindow>true</IsByWindow>
                          <Centroid>
                            <Location>
                              <pos>7.174999999999999 1.757692</pos>
                            </Location>
                          </Centroid>
                          <Width>0.35</Width>
                          <Length>0.35</Length>
                        </PassengerSpot>
                        <PassengerSpot id="seat_1778951795456" version="1.0">
                          <Label>39</Label>
                          <Orientation>backwards</Orientation>
                          <actualVehicleEquipments />
                          <SpotColumnRef ref="spot_column_1778936952743" version="1.0" />
                          <SpotRowRef ref="SpotRow/id/10" version="1.0" />
                          <Centroid>
                            <Location>
                              <pos>7.174999999999999 1.388462</pos>
                            </Location>
                          </Centroid>
                          <Width>0.35</Width>
                          <Length>0.35</Length>
                        </PassengerSpot>
                        <PassengerSpot id="seat_1778951796849" version="1.0">
                          <Label>44</Label>
                          <Orientation>backwards</Orientation>
                          <actualVehicleEquipments />
                          <SpotColumnRef ref="SpotColumn/id/B" version="1.0" />
                          <SpotRowRef ref="spot_row_1778936985294" version="1.0" />
                          <IsByWindow>true</IsByWindow>
                          <Centroid>
                            <Location>
                              <pos>8.313461538461542 0.251923</pos>
                            </Location>
                          </Centroid>
                          <Width>0.35</Width>
                          <Length>0.35</Length>
                        </PassengerSpot>
                        <PassengerSpot id="seat_1778951798401" version="1.0">
                          <Label>48</Label>
                          <Orientation>backwards</Orientation>
                          <actualVehicleEquipments />
                          <SpotColumnRef ref="SpotColumn/id/D" version="1.0" />
                          <SpotRowRef ref="spot_row_1778936985294" version="1.0" />
                          <Centroid>
                            <Location>
                              <pos>8.313461538461542 1.388462</pos>
                            </Location>
                          </Centroid>
                          <Width>0.35</Width>
                          <Length>0.35</Length>
                        </PassengerSpot>
                        <PassengerSpot id="seat_1778951799722" version="1.0">
                          <Label>47</Label>
                          <Orientation>backwards</Orientation>
                          <actualVehicleEquipments />
                          <SpotColumnRef ref="spot_column_1778936952743" version="1.0" />
                          <SpotRowRef ref="spot_row_1778936985294" version="1.0" />
                          <IsByWindow>true</IsByWindow>
                          <Centroid>
                            <Location>
                              <pos>8.313461538461542 1.757692</pos>
                            </Location>
                          </Centroid>
                          <Width>0.35</Width>
                          <Length>0.35</Length>
                        </PassengerSpot>
                        <PassengerSpot id="seat_1778951801345" version="1.0">
                          <Label>51</Label>
                          <Orientation>backwards</Orientation>
                          <actualVehicleEquipments />
                          <SpotColumnRef ref="SpotColumn/id/A" version="1.0" />
                          <SpotRowRef ref="spot_row_1778936986822" version="1.0" />
                          <IsByWindow>true</IsByWindow>
                          <Centroid>
                            <Location>
                              <pos>9.45192307692308 0.251923</pos>
                            </Location>
                          </Centroid>
                          <Width>0.35</Width>
                          <Length>0.35</Length>
                        </PassengerSpot>
                        <PassengerSpot id="seat_1778951803668" version="1.0">
                          <Label>52</Label>
                          <Orientation>backwards</Orientation>
                          <actualVehicleEquipments />
                          <SpotColumnRef ref="SpotColumn/id/B" version="1.0" />
                          <SpotRowRef ref="spot_row_1778936986822" version="1.0" />
                          <Centroid>
                            <Location>
                              <pos>9.45192307692308 0.621154</pos>
                            </Location>
                          </Centroid>
                          <Width>0.35</Width>
                          <Length>0.35</Length>
                        </PassengerSpot>
                        <PassengerSpot id="seat_1778951805192" version="1.0">
                          <Label>56</Label>
                          <Orientation>backwards</Orientation>
                          <actualVehicleEquipments />
                          <SpotColumnRef ref="SpotColumn/id/D" version="1.0" />
                          <SpotRowRef ref="spot_row_1778936986822" version="1.0" />
                          <Centroid>
                            <Location>
                              <pos>9.45192307692308 1.388462</pos>
                            </Location>
                          </Centroid>
                          <Width>0.35</Width>
                          <Length>0.35</Length>
                        </PassengerSpot>
                        <PassengerSpot id="seat_1778951806915" version="1.0">
                          <Label>55</Label>
                          <Orientation>backwards</Orientation>
                          <actualVehicleEquipments />
                          <SpotColumnRef ref="spot_column_1778936952743" version="1.0" />
                          <SpotRowRef ref="spot_row_1778936986822" version="1.0" />
                          <IsByWindow>true</IsByWindow>
                          <Centroid>
                            <Location>
                              <pos>9.45192307692308 1.757692</pos>
                            </Location>
                          </Centroid>
                          <Width>0.35</Width>
                          <Length>0.35</Length>
                        </PassengerSpot>
                        <PassengerSpot id="seat_1778951808793" version="1.0">
                          <Label>59</Label>
                          <Orientation>backwards</Orientation>
                          <actualVehicleEquipments />
                          <SpotColumnRef ref="SpotColumn/id/A" version="1.0" />
                          <SpotRowRef ref="spot_row_1778936987614" version="1.0" />
                          <IsByWindow>true</IsByWindow>
                          <Centroid>
                            <Location>
                              <pos>10.544230769230772 1.757692</pos>
                            </Location>
                          </Centroid>
                          <Width>0.35</Width>
                          <Length>0.35</Length>
                        </PassengerSpot>
                        <PassengerSpot id="seat_1778951810994" version="1.0">
                          <Label>60</Label>
                          <Orientation>backwards</Orientation>
                          <actualVehicleEquipments />
                          <SpotColumnRef ref="SpotColumn/id/B" version="1.0" />
                          <SpotRowRef ref="spot_row_1778936987614" version="1.0" />
                          <Centroid>
                            <Location>
                              <pos>10.544230769230772 0.621154</pos>
                            </Location>
                          </Centroid>
                          <Width>0.35</Width>
                          <Length>0.35</Length>
                        </PassengerSpot>
                        <PassengerSpot id="seat_1778951812968" version="1.0">
                          <Label>64</Label>
                          <Orientation>backwards</Orientation>
                          <actualVehicleEquipments />
                          <SpotColumnRef ref="SpotColumn/id/D" version="1.0" />
                          <SpotRowRef ref="spot_row_1778936987614" version="1.0" />
                          <Centroid>
                            <Location>
                              <pos>10.544230769230772 1.388462</pos>
                            </Location>
                          </Centroid>
                          <Width>0.35</Width>
                          <Length>0.35</Length>
                        </PassengerSpot>
                        <PassengerSpot id="seat_1778951814865" version="1.0">
                          <Label>63</Label>
                          <Orientation>backwards</Orientation>
                          <actualVehicleEquipments />
                          <SpotColumnRef ref="spot_column_1778936952743" version="1.0" />
                          <SpotRowRef ref="spot_row_1778936987614" version="1.0" />
                          <IsByWindow>true</IsByWindow>
                          <Centroid>
                            <Location>
                              <pos>10.544230769230772 0.251923</pos>
                            </Location>
                          </Centroid>
                          <Width>0.35</Width>
                          <Length>0.35</Length>
                        </PassengerSpot>
                        <PassengerSpot id="seat_1778951816513" version="1.0">
                          <Label>67</Label>
                          <Orientation>backwards</Orientation>
                          <actualVehicleEquipments />
                          <SpotColumnRef ref="SpotColumn/id/A" version="1.0" />
                          <SpotRowRef ref="spot_row_1778936988454" version="1.0" />
                          <IsByWindow>true</IsByWindow>
                          <Centroid>
                            <Location>
                              <pos>11.665384615384616 0.251923</pos>
                            </Location>
                          </Centroid>
                          <Width>0.35</Width>
                          <Length>0.35</Length>
                        </PassengerSpot>
                        <PassengerSpot id="seat_1778951818121" version="1.0">
                          <Label>68</Label>
                          <Orientation>backwards</Orientation>
                          <actualVehicleEquipments />
                          <SpotColumnRef ref="SpotColumn/id/B" version="1.0" />
                          <SpotRowRef ref="spot_row_1778936988454" version="1.0" />
                          <Centroid>
                            <Location>
                              <pos>11.665384615384616 0.621154</pos>
                            </Location>
                          </Centroid>
                          <Width>0.35</Width>
                          <Length>0.35</Length>
                        </PassengerSpot>
                        <PassengerSpot id="seat_1778951819978" version="1.0">
                          <Label>72</Label>
                          <Orientation>backwards</Orientation>
                          <actualVehicleEquipments />
                          <SpotColumnRef ref="SpotColumn/id/D" version="1.0" />
                          <SpotRowRef ref="spot_row_1778936988454" version="1.0" />
                          <Centroid>
                            <Location>
                              <pos>11.665384615384616 1.388462</pos>
                            </Location>
                          </Centroid>
                          <Width>0.35</Width>
                          <Length>0.35</Length>
                        </PassengerSpot>
                        <PassengerSpot id="seat_1778951821722" version="1.0">
                          <Label>71</Label>
                          <Orientation>backwards</Orientation>
                          <actualVehicleEquipments />
                          <SpotColumnRef ref="spot_column_1778936952743" version="1.0" />
                          <SpotRowRef ref="spot_row_1778936988454" version="1.0" />
                          <IsByWindow>true</IsByWindow>
                          <Centroid>
                            <Location>
                              <pos>11.665384615384616 1.757692</pos>
                            </Location>
                          </Centroid>
                          <Width>0.35</Width>
                          <Length>0.35</Length>
                        </PassengerSpot>
                      </passengerSpots>
                      <luggageSpots />
                      <deckEntrances>
                        <PassengerEntrance id="entrance_1778950926855" version="1.0">
                          <actualVehicleEquipments />
                          <Centroid>
                            <Location>
                              <pos>0.3111111111111111 0.05641</pos>
                            </Location>
                          </Centroid>
                        </PassengerEntrance>
                        <PassengerEntrance id="entrance_1778950928595" version="1.0">
                          <actualVehicleEquipments />
                          <Centroid>
                            <Location>
                              <pos>12.2 0.022222</pos>
                            </Location>
                          </Centroid>
                        </PassengerEntrance>
                        <PassengerEntrance id="entrance_1778950938091" version="1.0">
                          <actualVehicleEquipments />
                          <Centroid>
                            <Location>
                              <pos>0.3111111111111111 1.929915</pos>
                            </Location>
                          </Centroid>
                        </PassengerEntrance>
                        <PassengerEntrance id="entrance_1778950940714" version="1.0">
                          <actualVehicleEquipments />
                          <Centroid>
                            <Location>
                              <pos>12.184615384615384 1.947009</pos>
                            </Location>
                          </Centroid>
                        </PassengerEntrance>
                      </deckEntrances>
                      <deckEntranceUsage />
                      <deckEntranceCouples />
                      <deckSpaceCapacities />
                      <actualVehicleEquipments />
                      <FareClass>Standard</FareClass>
                    </PassengerSpace>
                  </deckSpaces>
                  <DeckLevelRef ref="deck_level_0" version="1.0" />
                  <Name />
                  <Width>2</Width>
                  <Length>13</Length>
                </Deck>
              </decks>
              <deckLevels>
                <DeckLevel id="deck_level_0" version="1.0">
                  <Label>Level 0</Label>
                </DeckLevel>
              </deckLevels>
            </DeckPlan>
          </deckPlans>
          <schematicMaps>
            <SchematicMap>
              <Name>Talent 3 seat map</Name>
              <ImageUri>https://www.example.com</ImageUri>
              <DepictedObjectRef ref="Train/id/1" />
            </SchematicMap>
          </schematicMaps>
        </ResourceFrame>
      </frames>
    </CompositeFrame>
  </dataObjects>
</PublicationDelivery>`})),Yn,Xn=e((()=>{Yn=`<?xml version='1.0' encoding='utf-8'?>
<PublicationDelivery version="1.2.2" schemaLocation="http://www.netex.org.uk/netex file:///home/robin/Projekte/NeTEx/xsd/NeTEx_publication.xsd">
  <PublicationTimestamp>2020-12-17T09:30:47.0Z</PublicationTimestamp>
  <ParticipantRef>SYS001</ParticipantRef>
  <dataObjects>
    <CompositeFrame version="any" id="CompositeFrame/id/1">
      <frames>
        <ResourceFrame version="any" id="ResourceFrame/id/1">
          <equipments>
            <AccessVehicleEquipment id="AccessVehicleEquipment/id/1" version="any">
              <Name>Ramp</Name>
              <Fixed>false</Fixed>
              <LowFloor>false</LowFloor>
              <HighFloor>false</HighFloor>
              <Ramp>true</Ramp>
            </AccessVehicleEquipment>
            <AccessVehicleEquipment id="AccessVehicleEquipment/id/2" version="any">
              <Name>Lift</Name>
              <Fixed>false</Fixed>
              <LowFloor>false</LowFloor>
              <HighFloor>false</HighFloor>
              <Ramp>false</Ramp>
            </AccessVehicleEquipment>
            <AccessVehicleEquipment id="AccessVehicleEquipment/id/3" version="any">
              <Name>Entrance dimensions</Name>
              <Fixed>false</Fixed>
              <LowFloor>false</LowFloor>
              <HighFloor>false</HighFloor>
              <Ramp>false</Ramp>
            </AccessVehicleEquipment>
          </equipments>
          <serviceFacilitySets>
            <ServiceFacilitySet version="any" id="ServiceFacilityTrain">
              <PassengerInformationFacilityList>nextStopIndicator

                stopAnnouncements</PassengerInformationFacilityList>
              <SanitaryFacilityList>toilet
                wheelchairAccessToilet</SanitaryFacilityList>
              <TicketingFacilityList />
            </ServiceFacilitySet>
            <ServiceFacilitySet version="any" id="ServiceFacilityQuiet">
              <NuisanceFacilityList>mobilePhoneFreeZone</NuisanceFacilityList>
            </ServiceFacilitySet>
          </serviceFacilitySets>
          <vehicleTypes>
            <Train version="any" id="Train/id/1">
              <privateCodes>
                <PrivateCode type="Fahrzeug-Ident-Nr.">
                  94808442201
                </PrivateCode>
              </privateCodes>
              <Name>Talent 3</Name>
              <Description>4 Teiler</Description>
              <ReversingDirection>true</ReversingDirection>
              <SelfPropelled>true</SelfPropelled>
              <PropulsionType>electric</PropulsionType>
              <TransportMode>rail</TransportMode>
              <capacities>
                <PassengerCapacity version="any" id="PassengerCapacity/id/1">
                  <FareClass>firstClass</FareClass>
                  <SeatingCapacity>8</SeatingCapacity>
                </PassengerCapacity>
                <PassengerCapacity version="any" id="PassengerCapacity/id/2">
                  <FareClass>secondClass</FareClass>
                  <SeatingCapacity>207</SeatingCapacity>
                  <StandingCapacity>275</StandingCapacity>
                  <WheelchairPlaceCapacity>2</WheelchairPlaceCapacity>
                  <BicycleRackCapacity>33</BicycleRackCapacity>
                </PassengerCapacity>
              </capacities>
              <LowFloor>false</LowFloor>
              <HasLiftOrRamp>true</HasLiftOrRamp>
              <BoardingHeight>0.6</BoardingHeight>
              <Length>72.3</Length>
              <Width>2.926</Width>
              <Height>4.26</Height>
              <facilities>
                <ServiceFacilitySetRef version="any" ref="ServiceFacilityTrain" />
              </facilities>
              <components>
                <TrainComponent version="any" id="TrainComponent/id/1">
                  <Label>201-3</Label>
                  <TractiveElementTypeRef version="any" ref="TractiveElementType/id/T3-1" />
                  <OperationalOrientation>forwards</OperationalOrientation>
                  <ForwardCoupling>
                    <Splittable>true</Splittable>
                    <ThroughAccess>noThroughAccess</ThroughAccess>
                  </ForwardCoupling>
                </TrainComponent>
                <TrainComponent version="any" id="TrainComponent/id/2">
                  <Label>201-8</Label>
                  <TrailingElementTypeRef version="any" ref="TrailingElementType/id/M3-1" />
                  <OperationalOrientation>forwards</OperationalOrientation>
                  <ForwardCoupling>
                    <Splittable>true</Splittable>
                    <ThroughAccess>openEntrance</ThroughAccess>
                  </ForwardCoupling>
                </TrainComponent>
                <TrainComponent version="any" id="TrainComponent/id/3">
                  <Label>701-7</Label>
                  <TrailingElementTypeRef version="any" ref="TrailingElementType/id/M2-1" />
                  <OperationalOrientation>forwards</OperationalOrientation>
                  <ForwardCoupling>
                    <Splittable>true</Splittable>
                    <ThroughAccess>openEntrance</ThroughAccess>
                  </ForwardCoupling>
                </TrainComponent>
                <TrainComponent version="any" id="TrainComponent/id/4">
                  <Label>701-9</Label>
                  <TractiveElementTypeRef version="any" ref="TractiveElementType/id/T2-1" />
                  <OperationalOrientation>forwards</OperationalOrientation>
                  <ForwardCoupling>
                    <Splittable>true</Splittable>
                    <ThroughAccess>openEntrance</ThroughAccess>
                  </ForwardCoupling>
                </TrainComponent>
              </components>
            </Train>
          </vehicleTypes>
          <trainElementTypes>
            <TractiveElementType version="any" id="TractiveElementType/id/T3-1">
              <Name>T3-1</Name>
              <TrainElementType>engine</TrainElementType>
              <Length>20.05</Length>
              <Width>2.926</Width>
              <Height>4.26</Height>
              <DeckPlanRef version="any" ref="DeckPlan/id/1" />
            </TractiveElementType>
            <TractiveElementType version="any" id="TractiveElementType/id/T2-1">
              <Name>T2-1</Name>
              <TrainElementType>engine</TrainElementType>
              <Length>20.05</Length>
              <Width>2.926</Width>
              <Height>4.26</Height>
            </TractiveElementType>
            <TrailingElementType version="any" id="TrailingElementType/id/M3-1">
              <Name>M3-1</Name>
              <TrainElementType>carriage</TrainElementType>
              <Length>16.1</Length>
              <Width>2.926</Width>
              <Height>4.26</Height>
            </TrailingElementType>
            <TrailingElementType version="any" id="TrailingElementType/id/M2-1">
              <Name>M2-1</Name>
              <TrainElementType>carriage</TrainElementType>
              <Length>16.1</Length>
              <Width>2.926</Width>
              <Height>4.26</Height>
            </TrailingElementType>
          </trainElementTypes>
          <deckPlans>
            <DeckPlan id="DeckPlan/id/1" version="any">
              <xmlTagName />
              <decks>
                <Deck id="Deck/id/1" version="any">
                  <spotRows>
                    <SpotRow id="SpotRow/id/1" />
                    <SpotRow id="SpotRow/id/2" />
                    <SpotRow id="SpotRow/id/3" />
                    <SpotRow id="SpotRow/id/4" />
                    <SpotRow id="SpotRow/id/5" />
                    <SpotRow id="SpotRow/id/6" />
                    <SpotRow id="SpotRow/id/7" />
                    <SpotRow id="SpotRow/id/8" />
                    <SpotRow id="SpotRow/id/9" />
                    <SpotRow id="SpotRow/id/10" />
                    <SpotRow id="SpotRow/id/11" />
                    <SpotRow id="spot_row_1778936985294" />
                    <SpotRow id="spot_row_1778936986382" />
                    <SpotRow id="spot_row_1778936986822" />
                    <SpotRow id="spot_row_1778936987173" />
                    <SpotRow id="spot_row_1778936987614" />
                    <SpotRow id="spot_row_1778936988038" />
                    <SpotRow id="spot_row_1778936988454" />
                    <SpotRow id="spot_row_1778936988839" />
                    <SpotRow id="spot_row_1778936989382" />
                  </spotRows>
                  <spotColumns>
                    <SpotColumn id="SpotColumn/id/A" />
                    <SpotColumn id="SpotColumn/id/B" />
                    <SpotColumn id="SpotColumn/id/C" />
                    <SpotColumn id="SpotColumn/id/D" />
                    <SpotColumn id="spot_column_1778936952743" />
                  </spotColumns>
                  <deckSpaces>
                    <PassengerSpace id="seating-area_1779021502009" version="1.0">
                      <Name>Area 1</Name>
                      <PassengerSpaceType>seatingArea</PassengerSpaceType>
                      <passengerSpots>
                        <PassengerSpot id="77" version="1.0">
                          <Label>77</Label>
                          <Orientation>backwards</Orientation>
                          <actualVehicleEquipments />
                          <SpotColumnRef ref="spot_column_1778936952743" version="1.0" />
                          <SpotRowRef ref="SpotRow/id/5" version="1.0" />
                          <IsByWindow>true</IsByWindow>
                          <Centroid>
                            <Location>
                              <pos>3.3902046783625726 0.206842</pos>
                            </Location>
                          </Centroid>
                          <Width>0.35</Width>
                          <Length>0.35</Length>
                        </PassengerSpot>
                        <PassengerSpot id="79" version="1.0">
                          <Label>79</Label>
                          <Orientation>forwards</Orientation>
                          <actualVehicleEquipments />
                          <SpotColumnRef ref="SpotColumn/id/A" version="1.0" />
                          <SpotRowRef ref="SpotRow/id/5" version="1.0" />
                          <IsByWindow>true</IsByWindow>
                          <Centroid>
                            <Location>
                              <pos>3.390204678362572 1.766429</pos>
                            </Location>
                          </Centroid>
                          <Width>0.35</Width>
                          <Length>0.35</Length>
                        </PassengerSpot>
                        <PassengerSpot id="75" version="1.0">
                          <Label>75</Label>
                          <Orientation>forwards</Orientation>
                          <actualVehicleEquipments />
                          <SpotColumnRef ref="SpotColumn/id/A" version="1.0" />
                          <SpotRowRef ref="SpotRow/id/4" version="1.0" />
                          <IsByWindow>true</IsByWindow>
                          <Centroid>
                            <Location>
                              <pos>2.705994152046783 1.766429</pos>
                            </Location>
                          </Centroid>
                          <Width>0.35</Width>
                          <Length>0.35</Length>
                        </PassengerSpot>
                        <PassengerSpot id="71" version="1.0">
                          <Label>71</Label>
                          <Orientation>forwards</Orientation>
                          <actualVehicleEquipments />
                          <SpotColumnRef ref="SpotColumn/id/A" version="1.0" />
                          <SpotRowRef ref="SpotRow/id/3" version="1.0" />
                          <IsByWindow>true</IsByWindow>
                          <Centroid>
                            <Location>
                              <pos>2.148099415204678 1.766429</pos>
                            </Location>
                          </Centroid>
                          <Width>0.35</Width>
                          <Length>0.35</Length>
                        </PassengerSpot>
                        <PassengerSpot id="67" version="1.0">
                          <Label>67</Label>
                          <Orientation>forwards</Orientation>
                          <actualVehicleEquipments />
                          <SpotColumnRef ref="SpotColumn/id/A" version="1.0" />
                          <SpotRowRef ref="SpotRow/id/2" version="1.0" />
                          <IsByWindow>true</IsByWindow>
                          <Centroid>
                            <Location>
                              <pos>1.5178571428571428 1.766429</pos>
                            </Location>
                          </Centroid>
                          <Width>0.35</Width>
                          <Length>0.35</Length>
                        </PassengerSpot>
                        <PassengerSpot id="63" version="1.0">
                          <Label>63</Label>
                          <Orientation>forwards</Orientation>
                          <actualVehicleEquipments />
                          <SpotColumnRef ref="SpotColumn/id/A" version="1.0" />
                          <SpotRowRef ref="SpotRow/id/1" version="1.0" />
                          <IsByWindow>true</IsByWindow>
                          <Centroid>
                            <Location>
                              <pos>0.8321428571428571 1.766429</pos>
                            </Location>
                          </Centroid>
                          <Width>0.35</Width>
                          <Length>0.35</Length>
                        </PassengerSpot>
                        <PassengerSpot id="64" version="1.0">
                          <Label>64</Label>
                          <Orientation>forwards</Orientation>
                          <actualVehicleEquipments />
                          <SpotColumnRef ref="SpotColumn/id/B" version="1.0" />
                          <SpotRowRef ref="SpotRow/id/1" version="1.0" />
                          <Centroid>
                            <Location>
                              <pos>0.8321428571428571 1.410714</pos>
                            </Location>
                          </Centroid>
                          <Width>0.35</Width>
                          <Length>0.35</Length>
                        </PassengerSpot>
                        <PassengerSpot id="68" version="1.0">
                          <Label>68</Label>
                          <Orientation>forwards</Orientation>
                          <actualVehicleEquipments />
                          <SpotColumnRef ref="SpotColumn/id/B" version="1.0" />
                          <SpotRowRef ref="SpotRow/id/2" version="1.0" />
                          <Centroid>
                            <Location>
                              <pos>1.5178571428571428 1.410714</pos>
                            </Location>
                          </Centroid>
                          <Width>0.35</Width>
                          <Length>0.35</Length>
                        </PassengerSpot>
                        <PassengerSpot id="72" version="1.0">
                          <Label>72</Label>
                          <Orientation>forwards</Orientation>
                          <actualVehicleEquipments />
                          <SpotColumnRef ref="SpotColumn/id/B" version="1.0" />
                          <SpotRowRef ref="SpotRow/id/3" version="1.0" />
                          <Centroid>
                            <Location>
                              <pos>2.148099415204678 1.410714</pos>
                            </Location>
                          </Centroid>
                          <Width>0.35</Width>
                          <Length>0.35</Length>
                        </PassengerSpot>
                        <PassengerSpot id="76" version="1.0">
                          <Label>76</Label>
                          <Orientation>forwards</Orientation>
                          <actualVehicleEquipments />
                          <SpotColumnRef ref="SpotColumn/id/B" version="1.0" />
                          <SpotRowRef ref="SpotRow/id/4" version="1.0" />
                          <Centroid>
                            <Location>
                              <pos>2.705994152046783 1.410714</pos>
                            </Location>
                          </Centroid>
                          <Width>0.35</Width>
                          <Length>0.35</Length>
                        </PassengerSpot>
                        <PassengerSpot id="80" version="1.0">
                          <Label>80</Label>
                          <Orientation>forwards</Orientation>
                          <actualVehicleEquipments />
                          <SpotColumnRef ref="SpotColumn/id/B" version="1.0" />
                          <SpotRowRef ref="SpotRow/id/5" version="1.0" />
                          <Centroid>
                            <Location>
                              <pos>3.3902046783625726 1.410714</pos>
                            </Location>
                          </Centroid>
                          <Width>0.35</Width>
                          <Length>0.35</Length>
                        </PassengerSpot>
                        <PassengerSpot id="62" version="1.0">
                          <Label>62</Label>
                          <Orientation>forwards</Orientation>
                          <actualVehicleEquipments />
                          <SpotColumnRef ref="SpotColumn/id/D" version="1.0" />
                          <SpotRowRef ref="SpotRow/id/1" version="1.0" />
                          <Centroid>
                            <Location>
                              <pos>0.8321428571428571 0.576316</pos>
                            </Location>
                          </Centroid>
                          <Width>0.35</Width>
                          <Length>0.35</Length>
                        </PassengerSpot>
                        <PassengerSpot id="61" version="1.0">
                          <Label>61</Label>
                          <Orientation>forwards</Orientation>
                          <actualVehicleEquipments />
                          <SpotColumnRef ref="spot_column_1778936952743" version="1.0" />
                          <SpotRowRef ref="SpotRow/id/1" version="1.0" />
                          <IsByWindow>true</IsByWindow>
                          <Centroid>
                            <Location>
                              <pos>0.8321428571428571 0.206842</pos>
                            </Location>
                          </Centroid>
                          <Width>0.35</Width>
                          <Length>0.35</Length>
                        </PassengerSpot>
                        <PassengerSpot id="66" version="1.0">
                          <Label>66</Label>
                          <Orientation>backwards</Orientation>
                          <actualVehicleEquipments />
                          <SpotColumnRef ref="SpotColumn/id/D" version="1.0" />
                          <SpotRowRef ref="SpotRow/id/2" version="1.0" />
                          <Centroid>
                            <Location>
                              <pos>1.5178571428571428 0.576316</pos>
                            </Location>
                          </Centroid>
                          <Width>0.35</Width>
                          <Length>0.35</Length>
                        </PassengerSpot>
                        <PassengerSpot id="65" version="1.0">
                          <Label>65</Label>
                          <Orientation>backwards</Orientation>
                          <actualVehicleEquipments />
                          <SpotColumnRef ref="spot_column_1778936952743" version="1.0" />
                          <SpotRowRef ref="SpotRow/id/2" version="1.0" />
                          <IsByWindow>true</IsByWindow>
                          <Centroid>
                            <Location>
                              <pos>1.5178571428571428 0.206842</pos>
                            </Location>
                          </Centroid>
                          <Width>0.35</Width>
                          <Length>0.35</Length>
                        </PassengerSpot>
                        <PassengerSpot id="70" version="1.0">
                          <Label>70</Label>
                          <Orientation>backwards</Orientation>
                          <actualVehicleEquipments />
                          <SpotColumnRef ref="SpotColumn/id/D" version="1.0" />
                          <SpotRowRef ref="SpotRow/id/3" version="1.0" />
                          <IsByAisle>true</IsByAisle>
                          <Centroid>
                            <Location>
                              <pos>2.148099415204678 0.576316</pos>
                            </Location>
                          </Centroid>
                          <Width>0.35</Width>
                          <Length>0.35</Length>
                        </PassengerSpot>
                        <PassengerSpot id="69" version="1.0">
                          <Label>69</Label>
                          <Orientation>backwards</Orientation>
                          <actualVehicleEquipments />
                          <SpotColumnRef ref="spot_column_1778936952743" version="1.0" />
                          <SpotRowRef ref="SpotRow/id/3" version="1.0" />
                          <IsByWindow>true</IsByWindow>
                          <Centroid>
                            <Location>
                              <pos>2.148099415204678 0.206842</pos>
                            </Location>
                          </Centroid>
                          <Width>0.35</Width>
                          <Length>0.35</Length>
                        </PassengerSpot>
                        <PassengerSpot id="74" version="1.0">
                          <Label>74</Label>
                          <Orientation>backwards</Orientation>
                          <actualVehicleEquipments />
                          <SpotColumnRef ref="SpotColumn/id/D" version="1.0" />
                          <SpotRowRef ref="SpotRow/id/4" version="1.0" />
                          <IsByAisle>true</IsByAisle>
                          <Centroid>
                            <Location>
                              <pos>2.705994152046783 0.576316</pos>
                            </Location>
                          </Centroid>
                          <Width>0.35</Width>
                          <Length>0.35</Length>
                        </PassengerSpot>
                        <PassengerSpot id="73" version="1.0">
                          <Label>73</Label>
                          <Orientation>backwards</Orientation>
                          <actualVehicleEquipments />
                          <SpotColumnRef ref="spot_column_1778936952743" version="1.0" />
                          <SpotRowRef ref="SpotRow/id/4" version="1.0" />
                          <IsByWindow>true</IsByWindow>
                          <Centroid>
                            <Location>
                              <pos>2.705994152046783 0.206842</pos>
                            </Location>
                          </Centroid>
                          <Width>0.35</Width>
                          <Length>0.35</Length>
                        </PassengerSpot>
                        <PassengerSpot id="78" version="1.0">
                          <Label>78</Label>
                          <Orientation>backwards</Orientation>
                          <actualVehicleEquipments />
                          <SpotColumnRef ref="SpotColumn/id/D" version="1.0" />
                          <SpotRowRef ref="SpotRow/id/5" version="1.0" />
                          <IsByAisle>true</IsByAisle>
                          <Centroid>
                            <Location>
                              <pos>3.3902046783625726 0.576316</pos>
                            </Location>
                          </Centroid>
                          <Width>0.35</Width>
                          <Length>0.35</Length>
                        </PassengerSpot>
                      </passengerSpots>
                      <luggageSpots />
                      <deckEntrances />
                      <deckEntranceUsage />
                      <deckEntranceCouples />
                      <deckSpaceCapacities />
                      <actualVehicleEquipments />
                      <PublicUse>true</PublicUse>
                      <TotalCapacity>0</TotalCapacity>
                      <FareClass>Standard</FareClass>
                      <AirConditioned>true</AirConditioned>
                    </PassengerSpace>
                    <PassengerSpace id="PassengerSpace/id/Main1" version="any">
                      <Name>Area 2</Name>
                      <PassengerSpaceType>seatingArea</PassengerSpaceType>
                      <passengerSpots>
                        <PassengerSpot id="1" version="1.0">
                          <Label>1</Label>
                          <Orientation>backwards</Orientation>
                          <actualVehicleEquipments />
                          <SpotColumnRef ref="SpotColumn/id/A" version="1.0" />
                          <SpotRowRef ref="spot_row_1778936989382" version="1.0" />
                          <IsByWindow>true</IsByWindow>
                          <Centroid>
                            <Location>
                              <pos>11.99318181818182 1.766429</pos>
                            </Location>
                          </Centroid>
                          <Width>0.35</Width>
                          <Length>0.35</Length>
                        </PassengerSpot>
                        <PassengerSpot id="2" version="1.0">
                          <Label>2</Label>
                          <Orientation>backwards</Orientation>
                          <actualVehicleEquipments />
                          <SpotColumnRef ref="SpotColumn/id/B" version="1.0" />
                          <SpotRowRef ref="spot_row_1778936989382" version="1.0" />
                          <Centroid>
                            <Location>
                              <pos>11.99318181818182 1.410714</pos>
                            </Location>
                          </Centroid>
                          <Width>0.35</Width>
                          <Length>0.35</Length>
                        </PassengerSpot>
                        <PassengerSpot id="5" version="1.0">
                          <Label>5</Label>
                          <Orientation>forwards</Orientation>
                          <actualVehicleEquipments />
                          <SpotColumnRef ref="SpotColumn/id/A" version="1.0" />
                          <SpotRowRef ref="spot_row_1778936988839" version="1.0" />
                          <IsByWindow>true</IsByWindow>
                          <Centroid>
                            <Location>
                              <pos>11.39317460317461 1.766429</pos>
                            </Location>
                          </Centroid>
                          <Width>0.35</Width>
                          <Length>0.35</Length>
                        </PassengerSpot>
                        <PassengerSpot id="6" version="1.0">
                          <Label>6</Label>
                          <Orientation>forwards</Orientation>
                          <actualVehicleEquipments />
                          <SpotColumnRef ref="SpotColumn/id/B" version="1.0" />
                          <SpotRowRef ref="spot_row_1778936988839" version="1.0" />
                          <Centroid>
                            <Location>
                              <pos>11.39317460317461 1.410714</pos>
                            </Location>
                          </Centroid>
                          <Width>0.35</Width>
                          <Length>0.35</Length>
                        </PassengerSpot>
                        <PassengerSpot id="9" version="1.0">
                          <Label>9</Label>
                          <Orientation>forwards</Orientation>
                          <actualVehicleEquipments />
                          <SpotColumnRef ref="SpotColumn/id/A" version="1.0" />
                          <SpotRowRef ref="spot_row_1778936988454" version="1.0" />
                          <IsByWindow>true</IsByWindow>
                          <Centroid>
                            <Location>
                              <pos>10.790467836257315 1.766429</pos>
                            </Location>
                          </Centroid>
                          <Width>0.35</Width>
                          <Length>0.35</Length>
                        </PassengerSpot>
                        <PassengerSpot id="10" version="1.0">
                          <Label>10</Label>
                          <Orientation>forwards</Orientation>
                          <actualVehicleEquipments />
                          <SpotColumnRef ref="SpotColumn/id/B" version="1.0" />
                          <SpotRowRef ref="spot_row_1778936988454" version="1.0" />
                          <Centroid>
                            <Location>
                              <pos>10.790467836257315 1.410714</pos>
                            </Location>
                          </Centroid>
                          <Width>0.35</Width>
                          <Length>0.35</Length>
                        </PassengerSpot>
                        <PassengerSpot id="13" version="1.0">
                          <Label>13</Label>
                          <Orientation>forwards</Orientation>
                          <actualVehicleEquipments />
                          <SpotColumnRef ref="SpotColumn/id/A" version="1.0" />
                          <SpotRowRef ref="spot_row_1778936988038" version="1.0" />
                          <IsByWindow>true</IsByWindow>
                          <Centroid>
                            <Location>
                              <pos>10.216783625730999 1.766429</pos>
                            </Location>
                          </Centroid>
                          <Width>0.35</Width>
                          <Length>0.35</Length>
                        </PassengerSpot>
                        <PassengerSpot id="14" version="1.0">
                          <Label>14</Label>
                          <Orientation>forwards</Orientation>
                          <actualVehicleEquipments />
                          <SpotColumnRef ref="SpotColumn/id/B" version="1.0" />
                          <SpotRowRef ref="spot_row_1778936988038" version="1.0" />
                          <Centroid>
                            <Location>
                              <pos>10.216783625730999 1.410714</pos>
                            </Location>
                          </Centroid>
                          <Width>0.35</Width>
                          <Length>0.35</Length>
                        </PassengerSpot>
                        <PassengerSpot id="17" version="1.0">
                          <Label>17</Label>
                          <Orientation>forwards</Orientation>
                          <actualVehicleEquipments />
                          <SpotColumnRef ref="SpotColumn/id/A" version="1.0" />
                          <SpotRowRef ref="spot_row_1778936987614" version="1.0" />
                          <IsByWindow>true</IsByWindow>
                          <Centroid>
                            <Location>
                              <pos>9.679678362573105 1.766429</pos>
                            </Location>
                          </Centroid>
                          <Width>0.35</Width>
                          <Length>0.35</Length>
                        </PassengerSpot>
                        <PassengerSpot id="18" version="1.0">
                          <Label>18</Label>
                          <Orientation>forwards</Orientation>
                          <actualVehicleEquipments />
                          <SpotColumnRef ref="SpotColumn/id/B" version="1.0" />
                          <SpotRowRef ref="spot_row_1778936987614" version="1.0" />
                          <Centroid>
                            <Location>
                              <pos>9.679678362573105 1.410714</pos>
                            </Location>
                          </Centroid>
                          <Width>0.35</Width>
                          <Length>0.35</Length>
                        </PassengerSpot>
                        <PassengerSpot id="21" version="1.0">
                          <Label>21</Label>
                          <Orientation>forwards</Orientation>
                          <actualVehicleEquipments />
                          <SpotColumnRef ref="SpotColumn/id/A" version="1.0" />
                          <SpotRowRef ref="spot_row_1778936987173" version="1.0" />
                          <IsByWindow>true</IsByWindow>
                          <Centroid>
                            <Location>
                              <pos>9.153362573099418 1.766429</pos>
                            </Location>
                          </Centroid>
                          <Width>0.35</Width>
                          <Length>0.35</Length>
                        </PassengerSpot>
                        <PassengerSpot id="22" version="1.0">
                          <Label>22</Label>
                          <Orientation>forwards</Orientation>
                          <actualVehicleEquipments />
                          <SpotColumnRef ref="SpotColumn/id/B" version="1.0" />
                          <SpotRowRef ref="spot_row_1778936987173" version="1.0" />
                          <Centroid>
                            <Location>
                              <pos>9.153362573099418 1.410714</pos>
                            </Location>
                          </Centroid>
                          <Width>0.35</Width>
                          <Length>0.35</Length>
                        </PassengerSpot>
                        <PassengerSpot id="33" version="1.0">
                          <Label>33</Label>
                          <Orientation>forwards</Orientation>
                          <actualVehicleEquipments />
                          <SpotColumnRef ref="SpotColumn/id/A" version="1.0" />
                          <SpotRowRef ref="spot_row_1778936985294" version="1.0" />
                          <IsByWindow>true</IsByWindow>
                          <Centroid>
                            <Location>
                              <pos>7.5323099415204675 1.766429</pos>
                            </Location>
                          </Centroid>
                          <Width>0.35</Width>
                          <Length>0.35</Length>
                        </PassengerSpot>
                        <PassengerSpot id="34" version="1.0">
                          <Label>34</Label>
                          <Orientation>forwards</Orientation>
                          <actualVehicleEquipments />
                          <SpotColumnRef ref="SpotColumn/id/B" version="1.0" />
                          <SpotRowRef ref="spot_row_1778936985294" version="1.0" />
                          <Centroid>
                            <Location>
                              <pos>7.5323099415204675 1.410714</pos>
                            </Location>
                          </Centroid>
                          <Width>0.35</Width>
                          <Length>0.35</Length>
                        </PassengerSpot>
                        <PassengerSpot id="37" version="1.0">
                          <Label>37</Label>
                          <Orientation>forwards</Orientation>
                          <actualVehicleEquipments />
                          <SpotColumnRef ref="SpotColumn/id/A" version="1.0" />
                          <SpotRowRef ref="SpotRow/id/11" version="1.0" />
                          <IsByWindow>true</IsByWindow>
                          <Centroid>
                            <Location>
                              <pos>6.963888888888887 1.766429</pos>
                            </Location>
                          </Centroid>
                          <Width>0.35</Width>
                          <Length>0.35</Length>
                        </PassengerSpot>
                        <PassengerSpot id="38" version="1.0">
                          <Label>38</Label>
                          <Orientation>forwards</Orientation>
                          <actualVehicleEquipments />
                          <SpotColumnRef ref="SpotColumn/id/B" version="1.0" />
                          <SpotRowRef ref="SpotRow/id/11" version="1.0" />
                          <Centroid>
                            <Location>
                              <pos>6.963888888888887 1.410714</pos>
                            </Location>
                          </Centroid>
                          <Width>0.35</Width>
                          <Length>0.35</Length>
                        </PassengerSpot>
                        <PassengerSpot id="41" version="1.0">
                          <Label>41</Label>
                          <Orientation>forwards</Orientation>
                          <actualVehicleEquipments />
                          <SpotColumnRef ref="SpotColumn/id/A" version="1.0" />
                          <SpotRowRef ref="SpotRow/id/10" version="1.0" />
                          <IsByWindow>true</IsByWindow>
                          <Centroid>
                            <Location>
                              <pos>6.374415204678361 1.766429</pos>
                            </Location>
                          </Centroid>
                          <Width>0.35</Width>
                          <Length>0.35</Length>
                        </PassengerSpot>
                        <PassengerSpot id="42" version="1.0">
                          <Label>42</Label>
                          <Orientation>forwards</Orientation>
                          <actualVehicleEquipments />
                          <SpotColumnRef ref="SpotColumn/id/B" version="1.0" />
                          <SpotRowRef ref="SpotRow/id/10" version="1.0" />
                          <Centroid>
                            <Location>
                              <pos>6.374415204678361 1.410714</pos>
                            </Location>
                          </Centroid>
                          <Width>0.35</Width>
                          <Length>0.35</Length>
                        </PassengerSpot>
                        <PassengerSpot id="45" version="1.0">
                          <Label>45</Label>
                          <Orientation>forwards</Orientation>
                          <actualVehicleEquipments />
                          <SpotColumnRef ref="SpotColumn/id/A" version="1.0" />
                          <SpotRowRef ref="SpotRow/id/9" version="1.0" />
                          <IsByWindow>true</IsByWindow>
                          <Centroid>
                            <Location>
                              <pos>5.82704678362573 1.766429</pos>
                            </Location>
                          </Centroid>
                          <Width>0.35</Width>
                          <Length>0.35</Length>
                        </PassengerSpot>
                        <PassengerSpot id="46" version="1.0">
                          <Label>46</Label>
                          <Orientation>forwards</Orientation>
                          <actualVehicleEquipments />
                          <SpotColumnRef ref="SpotColumn/id/B" version="1.0" />
                          <SpotRowRef ref="SpotRow/id/9" version="1.0" />
                          <Centroid>
                            <Location>
                              <pos>5.82704678362573 1.410714</pos>
                            </Location>
                          </Centroid>
                          <Width>0.35</Width>
                          <Length>0.35</Length>
                        </PassengerSpot>
                        <PassengerSpot id="49" version="1.0">
                          <Label>49</Label>
                          <Orientation>forwards</Orientation>
                          <actualVehicleEquipments />
                          <SpotColumnRef ref="SpotColumn/id/A" version="1.0" />
                          <SpotRowRef ref="SpotRow/id/8" version="1.0" />
                          <IsByWindow>true</IsByWindow>
                          <Centroid>
                            <Location>
                              <pos>5.216520467836255 1.766429</pos>
                            </Location>
                          </Centroid>
                          <Width>0.35</Width>
                          <Length>0.35</Length>
                        </PassengerSpot>
                        <PassengerSpot id="50" version="1.0">
                          <Label>50</Label>
                          <Orientation>forwards</Orientation>
                          <actualVehicleEquipments />
                          <SpotColumnRef ref="SpotColumn/id/B" version="1.0" />
                          <SpotRowRef ref="SpotRow/id/8" version="1.0" />
                          <Centroid>
                            <Location>
                              <pos>5.216520467836255 1.410714</pos>
                            </Location>
                          </Centroid>
                          <Width>0.35</Width>
                          <Length>0.35</Length>
                        </PassengerSpot>
                        <PassengerSpot id="53" version="1.0">
                          <Label>53</Label>
                          <Orientation>forwards</Orientation>
                          <actualVehicleEquipments />
                          <SpotColumnRef ref="SpotColumn/id/A" version="1.0" />
                          <SpotRowRef ref="SpotRow/id/7" version="1.0" />
                          <IsByWindow>true</IsByWindow>
                          <Centroid>
                            <Location>
                              <pos>4.584941520467836 1.766429</pos>
                            </Location>
                          </Centroid>
                          <Width>0.35</Width>
                          <Length>0.35</Length>
                        </PassengerSpot>
                        <PassengerSpot id="54" version="1.0">
                          <Label>54</Label>
                          <Orientation>forwards</Orientation>
                          <actualVehicleEquipments />
                          <SpotColumnRef ref="SpotColumn/id/B" version="1.0" />
                          <SpotRowRef ref="SpotRow/id/7" version="1.0" />
                          <Centroid>
                            <Location>
                              <pos>4.584941520467836 1.410714</pos>
                            </Location>
                          </Centroid>
                          <Width>0.35</Width>
                          <Length>0.35</Length>
                        </PassengerSpot>
                        <PassengerSpot id="83" version="1.0">
                          <Label>83</Label>
                          <Orientation>backwards</Orientation>
                          <actualVehicleEquipments />
                          <SpotColumnRef ref="SpotColumn/id/A" version="1.0" />
                          <SpotRowRef ref="SpotRow/id/6" version="1.0" />
                          <IsByWindow>true</IsByWindow>
                          <Centroid>
                            <Location>
                              <pos>4.016520467836257 1.766429</pos>
                            </Location>
                          </Centroid>
                          <Width>0.35</Width>
                          <Length>0.35</Length>
                        </PassengerSpot>
                        <PassengerSpot id="84" version="1.0">
                          <Label>84</Label>
                          <Orientation>backwards</Orientation>
                          <actualVehicleEquipments />
                          <SpotColumnRef ref="SpotColumn/id/B" version="1.0" />
                          <SpotRowRef ref="SpotRow/id/6" version="1.0" />
                          <Centroid>
                            <Location>
                              <pos>4.016520467836257 1.410714</pos>
                            </Location>
                          </Centroid>
                          <Width>0.35</Width>
                          <Length>0.35</Length>
                        </PassengerSpot>
                        <PassengerSpot id="82" version="1.0">
                          <Label>82</Label>
                          <Orientation>backwards</Orientation>
                          <actualVehicleEquipments />
                          <SpotColumnRef ref="SpotColumn/id/D" version="1.0" />
                          <SpotRowRef ref="SpotRow/id/6" version="1.0" />
                          <Centroid>
                            <Location>
                              <pos>4.016520467836257 0.576316</pos>
                            </Location>
                          </Centroid>
                          <Width>0.35</Width>
                          <Length>0.35</Length>
                        </PassengerSpot>
                        <PassengerSpot id="81" version="1.0">
                          <Label>81</Label>
                          <Orientation>backwards</Orientation>
                          <actualVehicleEquipments />
                          <SpotColumnRef ref="spot_column_1778936952743" version="1.0" />
                          <SpotRowRef ref="SpotRow/id/6" version="1.0" />
                          <IsByWindow>true</IsByWindow>
                          <Centroid>
                            <Location>
                              <pos>4.016520467836257 0.206842</pos>
                            </Location>
                          </Centroid>
                          <Width>0.35</Width>
                          <Length>0.35</Length>
                        </PassengerSpot>
                        <PassengerSpot id="56" version="1.0">
                          <Label>56</Label>
                          <Orientation>forwards</Orientation>
                          <actualVehicleEquipments />
                          <SpotColumnRef ref="SpotColumn/id/D" version="1.0" />
                          <SpotRowRef ref="SpotRow/id/7" version="1.0" />
                          <IsByAisle>true</IsByAisle>
                          <Centroid>
                            <Location>
                              <pos>4.584941520467836 0.576316</pos>
                            </Location>
                          </Centroid>
                          <Width>0.35</Width>
                          <Length>0.35</Length>
                        </PassengerSpot>
                        <PassengerSpot id="55" version="1.0">
                          <Label>55</Label>
                          <Orientation>forwards</Orientation>
                          <actualVehicleEquipments />
                          <SpotColumnRef ref="spot_column_1778936952743" version="1.0" />
                          <SpotRowRef ref="SpotRow/id/7" version="1.0" />
                          <IsByWindow>true</IsByWindow>
                          <Centroid>
                            <Location>
                              <pos>4.584941520467836 0.206842</pos>
                            </Location>
                          </Centroid>
                          <Width>0.35</Width>
                          <Length>0.35</Length>
                        </PassengerSpot>
                        <PassengerSpot id="52" version="1.0">
                          <Label>52</Label>
                          <Orientation>backwards</Orientation>
                          <actualVehicleEquipments />
                          <SpotColumnRef ref="SpotColumn/id/D" version="1.0" />
                          <SpotRowRef ref="SpotRow/id/8" version="1.0" />
                          <Centroid>
                            <Location>
                              <pos>5.216520467836256 0.576316</pos>
                            </Location>
                          </Centroid>
                          <Width>0.35</Width>
                          <Length>0.35</Length>
                        </PassengerSpot>
                        <PassengerSpot id="51" version="1.0">
                          <Label>51</Label>
                          <Orientation>backwards</Orientation>
                          <actualVehicleEquipments />
                          <SpotColumnRef ref="spot_column_1778936952743" version="1.0" />
                          <SpotRowRef ref="SpotRow/id/8" version="1.0" />
                          <IsByWindow>true</IsByWindow>
                          <Centroid>
                            <Location>
                              <pos>5.216520467836256 0.206842</pos>
                            </Location>
                          </Centroid>
                          <Width>0.35</Width>
                          <Length>0.35</Length>
                        </PassengerSpot>
                        <PassengerSpot id="48" version="1.0">
                          <Label>48</Label>
                          <Orientation>backwards</Orientation>
                          <actualVehicleEquipments />
                          <SpotColumnRef ref="SpotColumn/id/D" version="1.0" />
                          <SpotRowRef ref="SpotRow/id/9" version="1.0" />
                          <IsByAisle>true</IsByAisle>
                          <Centroid>
                            <Location>
                              <pos>5.82704678362573 0.576316</pos>
                            </Location>
                          </Centroid>
                          <Width>0.35</Width>
                          <Length>0.35</Length>
                        </PassengerSpot>
                        <PassengerSpot id="47" version="1.0">
                          <Label>47</Label>
                          <Orientation>backwards</Orientation>
                          <actualVehicleEquipments />
                          <SpotColumnRef ref="spot_column_1778936952743" version="1.0" />
                          <SpotRowRef ref="SpotRow/id/9" version="1.0" />
                          <IsByWindow>true</IsByWindow>
                          <Centroid>
                            <Location>
                              <pos>5.82704678362573 0.206842</pos>
                            </Location>
                          </Centroid>
                          <Width>0.35</Width>
                          <Length>0.35</Length>
                        </PassengerSpot>
                        <PassengerSpot id="44" version="1.0">
                          <Label>44</Label>
                          <Orientation>backwards</Orientation>
                          <actualVehicleEquipments />
                          <SpotColumnRef ref="SpotColumn/id/D" version="1.0" />
                          <SpotRowRef ref="SpotRow/id/10" version="1.0" />
                          <IsByAisle>true</IsByAisle>
                          <Centroid>
                            <Location>
                              <pos>6.374415204678362 0.576316</pos>
                            </Location>
                          </Centroid>
                          <Width>0.35</Width>
                          <Length>0.35</Length>
                        </PassengerSpot>
                        <PassengerSpot id="43" version="1.0">
                          <Label>43</Label>
                          <Orientation>backwards</Orientation>
                          <actualVehicleEquipments />
                          <SpotColumnRef ref="spot_column_1778936952743" version="1.0" />
                          <SpotRowRef ref="SpotRow/id/10" version="1.0" />
                          <IsByWindow>true</IsByWindow>
                          <Centroid>
                            <Location>
                              <pos>6.374415204678362 0.206842</pos>
                            </Location>
                          </Centroid>
                          <Width>0.35</Width>
                          <Length>0.35</Length>
                        </PassengerSpot>
                        <PassengerSpot id="40" version="1.0">
                          <Label>40</Label>
                          <Orientation>backwards</Orientation>
                          <actualVehicleEquipments />
                          <SpotColumnRef ref="SpotColumn/id/D" version="1.0" />
                          <SpotRowRef ref="SpotRow/id/11" version="1.0" />
                          <IsByAisle>true</IsByAisle>
                          <Centroid>
                            <Location>
                              <pos>6.963888888888888 0.576316</pos>
                            </Location>
                          </Centroid>
                          <Width>0.35</Width>
                          <Length>0.35</Length>
                        </PassengerSpot>
                        <PassengerSpot id="39" version="1.0">
                          <Label>39</Label>
                          <Orientation>backwards</Orientation>
                          <actualVehicleEquipments />
                          <SpotColumnRef ref="spot_column_1778936952743" version="1.0" />
                          <SpotRowRef ref="SpotRow/id/11" version="1.0" />
                          <IsByWindow>true</IsByWindow>
                          <Centroid>
                            <Location>
                              <pos>6.963888888888888 0.206842</pos>
                            </Location>
                          </Centroid>
                          <Width>0.35</Width>
                          <Length>0.35</Length>
                        </PassengerSpot>
                        <PassengerSpot id="36" version="1.0">
                          <Label>36</Label>
                          <Orientation>backwards</Orientation>
                          <actualVehicleEquipments />
                          <SpotColumnRef ref="SpotColumn/id/D" version="1.0" />
                          <SpotRowRef ref="spot_row_1778936985294" version="1.0" />
                          <IsByAisle>true</IsByAisle>
                          <Centroid>
                            <Location>
                              <pos>7.5323099415204675 0.576316</pos>
                            </Location>
                          </Centroid>
                          <Width>0.35</Width>
                          <Length>0.35</Length>
                        </PassengerSpot>
                        <PassengerSpot id="35" version="1.0">
                          <Label>35</Label>
                          <Orientation>backwards</Orientation>
                          <actualVehicleEquipments />
                          <SpotColumnRef ref="spot_column_1778936952743" version="1.0" />
                          <SpotRowRef ref="spot_row_1778936985294" version="1.0" />
                          <IsByWindow>true</IsByWindow>
                          <Centroid>
                            <Location>
                              <pos>7.5323099415204675 0.206842</pos>
                            </Location>
                          </Centroid>
                          <Width>0.35</Width>
                          <Length>0.35</Length>
                        </PassengerSpot>
                        <PassengerSpot id="24" version="1.0">
                          <Label>24</Label>
                          <Orientation>backwards</Orientation>
                          <actualVehicleEquipments />
                          <SpotColumnRef ref="SpotColumn/id/D" version="1.0" />
                          <SpotRowRef ref="spot_row_1778936987173" version="1.0" />
                          <IsByAisle>true</IsByAisle>
                          <Centroid>
                            <Location>
                              <pos>9.153362573099418 0.576316</pos>
                            </Location>
                          </Centroid>
                          <Width>0.35</Width>
                          <Length>0.35</Length>
                        </PassengerSpot>
                        <PassengerSpot id="23" version="1.0">
                          <Label>23</Label>
                          <Orientation>backwards</Orientation>
                          <actualVehicleEquipments />
                          <SpotColumnRef ref="spot_column_1778936952743" version="1.0" />
                          <SpotRowRef ref="spot_row_1778936987173" version="1.0" />
                          <IsByWindow>true</IsByWindow>
                          <Centroid>
                            <Location>
                              <pos>9.153362573099418 0.206842</pos>
                            </Location>
                          </Centroid>
                          <Width>0.35</Width>
                          <Length>0.35</Length>
                        </PassengerSpot>
                        <PassengerSpot id="20" version="1.0">
                          <Label>20</Label>
                          <Orientation>backwards</Orientation>
                          <actualVehicleEquipments />
                          <SpotColumnRef ref="SpotColumn/id/D" version="1.0" />
                          <SpotRowRef ref="spot_row_1778936987614" version="1.0" />
                          <IsByAisle>true</IsByAisle>
                          <Centroid>
                            <Location>
                              <pos>9.679678362573103 0.576316</pos>
                            </Location>
                          </Centroid>
                          <Width>0.35</Width>
                          <Length>0.35</Length>
                        </PassengerSpot>
                        <PassengerSpot id="19" version="1.0">
                          <Label>19</Label>
                          <Orientation>backwards</Orientation>
                          <actualVehicleEquipments />
                          <SpotColumnRef ref="spot_column_1778936952743" version="1.0" />
                          <SpotRowRef ref="spot_row_1778936987614" version="1.0" />
                          <IsByWindow>true</IsByWindow>
                          <Centroid>
                            <Location>
                              <pos>9.679678362573103 0.206842</pos>
                            </Location>
                          </Centroid>
                          <Width>0.35</Width>
                          <Length>0.35</Length>
                        </PassengerSpot>
                        <PassengerSpot id="16" version="1.0">
                          <Label>16</Label>
                          <Orientation>backwards</Orientation>
                          <actualVehicleEquipments />
                          <SpotColumnRef ref="SpotColumn/id/D" version="1.0" />
                          <SpotRowRef ref="spot_row_1778936988038" version="1.0" />
                          <IsByAisle>true</IsByAisle>
                          <Centroid>
                            <Location>
                              <pos>10.216783625730997 0.576316</pos>
                            </Location>
                          </Centroid>
                          <Width>0.35</Width>
                          <Length>0.35</Length>
                        </PassengerSpot>
                        <PassengerSpot id="15" version="1.0">
                          <Label>15</Label>
                          <Orientation>backwards</Orientation>
                          <actualVehicleEquipments />
                          <SpotColumnRef ref="spot_column_1778936952743" version="1.0" />
                          <SpotRowRef ref="spot_row_1778936988038" version="1.0" />
                          <IsByWindow>true</IsByWindow>
                          <Centroid>
                            <Location>
                              <pos>10.216783625730997 0.206842</pos>
                            </Location>
                          </Centroid>
                          <Width>0.35</Width>
                          <Length>0.35</Length>
                        </PassengerSpot>
                        <PassengerSpot id="12" version="1.0">
                          <Label>12</Label>
                          <Orientation>backwards</Orientation>
                          <actualVehicleEquipments />
                          <SpotColumnRef ref="SpotColumn/id/D" version="1.0" />
                          <SpotRowRef ref="spot_row_1778936988454" version="1.0" />
                          <Centroid>
                            <Location>
                              <pos>10.790467836257314 0.576316</pos>
                            </Location>
                          </Centroid>
                          <Width>0.35</Width>
                          <Length>0.35</Length>
                        </PassengerSpot>
                        <PassengerSpot id="11" version="1.0">
                          <Label>11</Label>
                          <Orientation>backwards</Orientation>
                          <actualVehicleEquipments />
                          <SpotColumnRef ref="spot_column_1778936952743" version="1.0" />
                          <SpotRowRef ref="spot_row_1778936988454" version="1.0" />
                          <IsByWindow>true</IsByWindow>
                          <Centroid>
                            <Location>
                              <pos>10.790467836257314 0.206842</pos>
                            </Location>
                          </Centroid>
                          <Width>0.35</Width>
                          <Length>0.35</Length>
                        </PassengerSpot>
                        <PassengerSpot id="8" version="1.0">
                          <Label>8</Label>
                          <Orientation>backwards</Orientation>
                          <actualVehicleEquipments />
                          <SpotColumnRef ref="SpotColumn/id/D" version="1.0" />
                          <SpotRowRef ref="spot_row_1778936988839" version="1.0" />
                          <Centroid>
                            <Location>
                              <pos>11.393174603174609 0.576316</pos>
                            </Location>
                          </Centroid>
                          <Width>0.35</Width>
                          <Length>0.35</Length>
                        </PassengerSpot>
                        <PassengerSpot id="7" version="1.0">
                          <Label>7</Label>
                          <Orientation>backwards</Orientation>
                          <actualVehicleEquipments />
                          <SpotColumnRef ref="spot_column_1778936952743" version="1.0" />
                          <SpotRowRef ref="spot_row_1778936988839" version="1.0" />
                          <IsByWindow>true</IsByWindow>
                          <Centroid>
                            <Location>
                              <pos>11.393174603174609 0.206842</pos>
                            </Location>
                          </Centroid>
                          <Width>0.35</Width>
                          <Length>0.35</Length>
                        </PassengerSpot>
                        <PassengerSpot id="4" version="1.0">
                          <Label>4</Label>
                          <Orientation>backwards</Orientation>
                          <actualVehicleEquipments />
                          <SpotColumnRef ref="SpotColumn/id/D" version="1.0" />
                          <SpotRowRef ref="spot_row_1778936989382" version="1.0" />
                          <Centroid>
                            <Location>
                              <pos>12.015714285714289 0.576316</pos>
                            </Location>
                          </Centroid>
                          <Width>0.35</Width>
                          <Length>0.35</Length>
                        </PassengerSpot>
                        <PassengerSpot id="3" version="1.0">
                          <Label>3</Label>
                          <Orientation>backwards</Orientation>
                          <actualVehicleEquipments />
                          <SpotColumnRef ref="spot_column_1778936952743" version="1.0" />
                          <SpotRowRef ref="spot_row_1778936989382" version="1.0" />
                          <IsByWindow>true</IsByWindow>
                          <Centroid>
                            <Location>
                              <pos>12.015714285714289 0.206842</pos>
                            </Location>
                          </Centroid>
                          <Width>0.35</Width>
                          <Length>0.35</Length>
                        </PassengerSpot>
                      </passengerSpots>
                      <luggageSpots />
                      <deckEntrances>
                        <PassengerEntrance id="entrance_1779021475977" version="1.0">
                          <Name>Entrance</Name>
                          <Label>E</Label>
                          <Width>0.6</Width>
                          <Height>2</Height>
                          <actualVehicleEquipments />
                          <PublicUse>true</PublicUse>
                          <VehicleSide>leftSide</VehicleSide>
                          <DeckEntranceType>external</DeckEntranceType>
                          <Centroid>
                            <Location>
                              <pos>0.12 1.84</pos>
                            </Location>
                          </Centroid>
                        </PassengerEntrance>
                        <PassengerEntrance id="entrance_1779021477501" version="1.0">
                          <Name>Entrance</Name>
                          <Label>E</Label>
                          <Width>0.6</Width>
                          <Height>2</Height>
                          <actualVehicleEquipments />
                          <PublicUse>true</PublicUse>
                          <VehicleSide>leftSide</VehicleSide>
                          <DeckEntranceType>external</DeckEntranceType>
                          <Centroid>
                            <Location>
                              <pos>12.38 -0.06</pos>
                            </Location>
                          </Centroid>
                        </PassengerEntrance>
                        <PassengerEntrance id="entrance_1779021478836" version="1.0">
                          <Name>Entrance</Name>
                          <Label>E</Label>
                          <Width>0.6</Width>
                          <Height>2</Height>
                          <actualVehicleEquipments />
                          <PublicUse>true</PublicUse>
                          <VehicleSide>leftSide</VehicleSide>
                          <DeckEntranceType>external</DeckEntranceType>
                          <Centroid>
                            <Location>
                              <pos>12.36 1.88</pos>
                            </Location>
                          </Centroid>
                        </PassengerEntrance>
                        <PassengerEntrance id="entrance_1779021480092" version="1.0">
                          <Name>Entrance</Name>
                          <Label>E</Label>
                          <Width>0.6</Width>
                          <Height>2</Height>
                          <actualVehicleEquipments />
                          <PublicUse>true</PublicUse>
                          <VehicleSide>leftSide</VehicleSide>
                          <SequenceFromFront>2.14</SequenceFromFront>
                          <DeckEntranceType>external</DeckEntranceType>
                          <Centroid>
                            <Location>
                              <pos>0.1 -0.04</pos>
                            </Location>
                          </Centroid>
                        </PassengerEntrance>
                      </deckEntrances>
                      <deckEntranceUsage />
                      <deckEntranceCouples />
                      <deckSpaceCapacities />
                      <actualVehicleEquipments />
                      <PublicUse>true</PublicUse>
                      <FareClass>Standard</FareClass>
                    </PassengerSpace>
                    <PassengerSpace id="seating-area_1778937141072" version="1.0">
                      <Name>Premium Seats</Name>
                      <PassengerSpaceType>seatingArea</PassengerSpaceType>
                      <passengerSpots>
                        <PassengerSpot id="25" version="1.0">
                          <Label>25</Label>
                          <Orientation>forwards</Orientation>
                          <actualVehicleEquipments />
                          <SpotColumnRef ref="SpotColumn/id/A" version="1.0" />
                          <SpotRowRef ref="spot_row_1778936986822" version="1.0" />
                          <IsByWindow>true</IsByWindow>
                          <Centroid>
                            <Location>
                              <pos>8.648099415204678 1.766429</pos>
                            </Location>
                          </Centroid>
                          <Width>0.35</Width>
                          <Length>0.35</Length>
                        </PassengerSpot>
                        <PassengerSpot id="26" version="1.0">
                          <Label>26</Label>
                          <Orientation>forwards</Orientation>
                          <actualVehicleEquipments />
                          <SpotColumnRef ref="SpotColumn/id/B" version="1.0" />
                          <SpotRowRef ref="spot_row_1778936986822" version="1.0" />
                          <Centroid>
                            <Location>
                              <pos>8.648099415204678 1.410714</pos>
                            </Location>
                          </Centroid>
                          <Width>0.35</Width>
                          <Length>0.35</Length>
                        </PassengerSpot>
                        <PassengerSpot id="29" version="1.0">
                          <Label>29</Label>
                          <Orientation>forwards</Orientation>
                          <actualVehicleEquipments />
                          <SpotColumnRef ref="SpotColumn/id/A" version="1.0" />
                          <SpotRowRef ref="spot_row_1778936986382" version="1.0" />
                          <IsByWindow>true</IsByWindow>
                          <Centroid>
                            <Location>
                              <pos>8.111257309941521 1.766429</pos>
                            </Location>
                          </Centroid>
                          <Width>0.35</Width>
                          <Length>0.35</Length>
                        </PassengerSpot>
                        <PassengerSpot id="30" version="1.0">
                          <Label>30</Label>
                          <Orientation>forwards</Orientation>
                          <actualVehicleEquipments />
                          <SpotColumnRef ref="SpotColumn/id/B" version="1.0" />
                          <SpotRowRef ref="spot_row_1778936986382" version="1.0" />
                          <Centroid>
                            <Location>
                              <pos>8.111257309941521 1.410714</pos>
                            </Location>
                          </Centroid>
                          <Width>0.35</Width>
                          <Length>0.35</Length>
                        </PassengerSpot>
                        <PassengerSpot id="32" version="1.0">
                          <Label>32</Label>
                          <Orientation>backwards</Orientation>
                          <actualVehicleEquipments />
                          <SpotColumnRef ref="SpotColumn/id/D" version="1.0" />
                          <SpotRowRef ref="spot_row_1778936986382" version="1.0" />
                          <IsByAisle>true</IsByAisle>
                          <Centroid>
                            <Location>
                              <pos>8.111257309941521 0.576316</pos>
                            </Location>
                          </Centroid>
                          <Width>0.35</Width>
                          <Length>0.35</Length>
                        </PassengerSpot>
                        <PassengerSpot id="31" version="1.0">
                          <Label>31</Label>
                          <Orientation>backwards</Orientation>
                          <actualVehicleEquipments />
                          <SpotColumnRef ref="spot_column_1778936952743" version="1.0" />
                          <SpotRowRef ref="spot_row_1778936986382" version="1.0" />
                          <IsByWindow>true</IsByWindow>
                          <Centroid>
                            <Location>
                              <pos>8.111257309941521 0.206842</pos>
                            </Location>
                          </Centroid>
                          <Width>0.35</Width>
                          <Length>0.35</Length>
                        </PassengerSpot>
                        <PassengerSpot id="28" version="1.0">
                          <Label>28</Label>
                          <Orientation>backwards</Orientation>
                          <actualVehicleEquipments />
                          <SpotColumnRef ref="SpotColumn/id/D" version="1.0" />
                          <SpotRowRef ref="spot_row_1778936986822" version="1.0" />
                          <IsByAisle>true</IsByAisle>
                          <Centroid>
                            <Location>
                              <pos>8.648099415204678 0.576316</pos>
                            </Location>
                          </Centroid>
                          <Width>0.35</Width>
                          <Length>0.35</Length>
                        </PassengerSpot>
                        <PassengerSpot id="27" version="1.0">
                          <Label>27</Label>
                          <Orientation>backwards</Orientation>
                          <actualVehicleEquipments />
                          <SpotColumnRef ref="spot_column_1778936952743" version="1.0" />
                          <SpotRowRef ref="spot_row_1778936986822" version="1.0" />
                          <IsByWindow>true</IsByWindow>
                          <Centroid>
                            <Location>
                              <pos>8.648099415204678 0.206842</pos>
                            </Location>
                          </Centroid>
                          <Width>0.35</Width>
                          <Length>0.35</Length>
                        </PassengerSpot>
                      </passengerSpots>
                      <luggageSpots />
                      <deckEntrances />
                      <deckEntranceUsage />
                      <deckEntranceCouples />
                      <deckSpaceCapacities />
                      <actualVehicleEquipments />
                      <PublicUse>true</PublicUse>
                      <FareClass>High</FareClass>
                    </PassengerSpace>
                  </deckSpaces>
                  <DeckLevelRef ref="deck_level_0" version="1.0" />
                  <Name />
                  <Width>2</Width>
                  <Length>13</Length>
                </Deck>
              </decks>
              <deckLevels>
                <DeckLevel id="deck_level_0" version="1.0">
                  <Label>Level 0</Label>
                </DeckLevel>
              </deckLevels>
            </DeckPlan>
          </deckPlans>
          <schematicMaps>
            <SchematicMap>
              <Name>Talent 3 seat map</Name>
              <ImageUri>https://www.example.com</ImageUri>
              <DepictedObjectRef ref="Train/id/1" />
            </SchematicMap>
          </schematicMaps>
        </ResourceFrame>
      </frames>
    </CompositeFrame>
  </dataObjects>
</PublicationDelivery>`})),Zn,Qn=e((()=>{Zn=`<?xml version='1.0' encoding='utf-8'?>
<PublicationDelivery version="1.2.2" schemaLocation="http://www.netex.org.uk/netex file:///home/robin/Projekte/NeTEx/xsd/NeTEx_publication.xsd">
  <PublicationTimestamp>2020-12-17T09:30:47.0Z</PublicationTimestamp>
  <ParticipantRef>SYS001</ParticipantRef>
  <dataObjects>
    <CompositeFrame version="any" id="CompositeFrame/id/1">
      <frames>
        <ResourceFrame version="any" id="ResourceFrame/id/1">
          <equipments>
            <AccessVehicleEquipment id="AccessVehicleEquipment/id/1" version="any">
              <Name>Ramp</Name>
              <Fixed>false</Fixed>
              <LowFloor>false</LowFloor>
              <HighFloor>false</HighFloor>
              <Ramp>true</Ramp>
            </AccessVehicleEquipment>
            <AccessVehicleEquipment id="AccessVehicleEquipment/id/2" version="any">
              <Name>Lift</Name>
              <Fixed>false</Fixed>
              <LowFloor>false</LowFloor>
              <HighFloor>false</HighFloor>
              <Ramp>false</Ramp>
            </AccessVehicleEquipment>
            <AccessVehicleEquipment id="AccessVehicleEquipment/id/3" version="any">
              <Name>Entrance dimensions</Name>
              <Fixed>false</Fixed>
              <LowFloor>false</LowFloor>
              <HighFloor>false</HighFloor>
              <Ramp>false</Ramp>
            </AccessVehicleEquipment>
          </equipments>
          <serviceFacilitySets>
            <ServiceFacilitySet version="any" id="ServiceFacilityTrain">
              <PassengerInformationFacilityList>nextStopIndicator

                stopAnnouncements</PassengerInformationFacilityList>
              <SanitaryFacilityList>toilet
                wheelchairAccessToilet</SanitaryFacilityList>
              <TicketingFacilityList />
            </ServiceFacilitySet>
            <ServiceFacilitySet version="any" id="ServiceFacilityQuiet">
              <NuisanceFacilityList>mobilePhoneFreeZone</NuisanceFacilityList>
            </ServiceFacilitySet>
          </serviceFacilitySets>
          <vehicleTypes>
            <Train version="any" id="Train/id/1">
              <Name>Talent 3</Name>
              <Description>4 Teiler</Description>
              <ReversingDirection>true</ReversingDirection>
              <SelfPropelled>true</SelfPropelled>
              <PropulsionType>electric</PropulsionType>
              <TransportMode>rail</TransportMode>
              <capacities>
                <PassengerCapacity version="any" id="PassengerCapacity/id/1">
                  <FareClass>firstClass</FareClass>
                  <SeatingCapacity>8</SeatingCapacity>
                </PassengerCapacity>
                <PassengerCapacity version="any" id="PassengerCapacity/id/2">
                  <FareClass>secondClass</FareClass>
                  <SeatingCapacity>207</SeatingCapacity>
                  <StandingCapacity>275</StandingCapacity>
                  <WheelchairPlaceCapacity>2</WheelchairPlaceCapacity>
                  <BicycleRackCapacity>33</BicycleRackCapacity>
                </PassengerCapacity>
              </capacities>
              <LowFloor>false</LowFloor>
              <HasLiftOrRamp>true</HasLiftOrRamp>
              <BoardingHeight>0.6</BoardingHeight>
              <Length>72.3</Length>
              <Width>2.926</Width>
              <Height>4.26</Height>
              <facilities>
                <ServiceFacilitySetRef version="any" ref="ServiceFacilityTrain" />
              </facilities>
              <components>
                <TrainComponent version="any" id="TrainComponent/id/1">
                  <Label>201-3</Label>
                  <TractiveElementTypeRef version="any" ref="TractiveElementType/id/T3-1" />
                  <OperationalOrientation>forwards</OperationalOrientation>
                  <ForwardCoupling>
                    <Splittable>true</Splittable>
                    <ThroughAccess>noThroughAccess</ThroughAccess>
                  </ForwardCoupling>
                </TrainComponent>
                <TrainComponent version="any" id="TrainComponent/id/2">
                  <Label>201-8</Label>
                  <TrailingElementTypeRef version="any" ref="TrailingElementType/id/M3-1" />
                  <OperationalOrientation>forwards</OperationalOrientation>
                  <ForwardCoupling>
                    <Splittable>true</Splittable>
                    <ThroughAccess>openEntrance</ThroughAccess>
                  </ForwardCoupling>
                </TrainComponent>
                <TrainComponent version="any" id="TrainComponent/id/3">
                  <Label>701-7</Label>
                  <TrailingElementTypeRef version="any" ref="TrailingElementType/id/M2-1" />
                  <OperationalOrientation>forwards</OperationalOrientation>
                  <ForwardCoupling>
                    <Splittable>true</Splittable>
                    <ThroughAccess>openEntrance</ThroughAccess>
                  </ForwardCoupling>
                </TrainComponent>
                <TrainComponent version="any" id="TrainComponent/id/4">
                  <Label>701-9</Label>
                  <TractiveElementTypeRef version="any" ref="TractiveElementType/id/T2-1" />
                  <OperationalOrientation>forwards</OperationalOrientation>
                  <ForwardCoupling>
                    <Splittable>true</Splittable>
                    <ThroughAccess>openEntrance</ThroughAccess>
                  </ForwardCoupling>
                </TrainComponent>
              </components>
            </Train>
          </vehicleTypes>
          <trainElementTypes>
            <TractiveElementType version="any" id="TractiveElementType/id/T3-1">
              <Name>T3-1</Name>
              <TrainElementType>engine</TrainElementType>
              <Length>20.05</Length>
              <Width>2.926</Width>
              <Height>4.26</Height>
              <DeckPlanRef version="any" ref="DeckPlan/id/1" />
            </TractiveElementType>
            <TractiveElementType version="any" id="TractiveElementType/id/T2-1">
              <Name>T2-1</Name>
              <TrainElementType>engine</TrainElementType>
              <Length>20.05</Length>
              <Width>2.926</Width>
              <Height>4.26</Height>
            </TractiveElementType>
            <TrailingElementType version="any" id="TrailingElementType/id/M3-1">
              <Name>M3-1</Name>
              <TrainElementType>carriage</TrainElementType>
              <Length>16.1</Length>
              <Width>2.926</Width>
              <Height>4.26</Height>
            </TrailingElementType>
            <TrailingElementType version="any" id="TrailingElementType/id/M2-1">
              <Name>M2-1</Name>
              <TrainElementType>carriage</TrainElementType>
              <Length>16.1</Length>
              <Width>2.926</Width>
              <Height>4.26</Height>
            </TrailingElementType>
          </trainElementTypes>
          <deckPlans>
            <DeckPlan id="DeckPlan/id/1" version="any">
              <xmlTagName />
              <decks>
                <Deck id="Deck/id/1" version="any">
                  <spotRows>
                    <SpotRow id="SpotRow/id/1" />
                    <SpotRow id="SpotRow/id/2" />
                    <SpotRow id="SpotRow/id/3" />
                    <SpotRow id="SpotRow/id/4" />
                    <SpotRow id="SpotRow/id/5" />
                    <SpotRow id="SpotRow/id/6" />
                    <SpotRow id="SpotRow/id/7" />
                    <SpotRow id="SpotRow/id/8" />
                    <SpotRow id="SpotRow/id/9" />
                    <SpotRow id="SpotRow/id/10" />
                    <SpotRow id="SpotRow/id/11" />
                    <SpotRow id="spot_row_1778936985294" />
                    <SpotRow id="spot_row_1778936986382" />
                    <SpotRow id="spot_row_1778936986822" />
                    <SpotRow id="spot_row_1778936987173" />
                    <SpotRow id="spot_row_1778936987614" />
                    <SpotRow id="spot_row_1778936988038" />
                    <SpotRow id="spot_row_1778936988454" />
                    <SpotRow id="spot_row_1778936988839" />
                    <SpotRow id="spot_row_1778936989382" />
                    <SpotRow id="spot_row_1778949628771" />
                    <SpotRow id="spot_row_1778949629523" />
                  </spotRows>
                  <spotColumns>
                    <SpotColumn id="SpotColumn/id/A" />
                    <SpotColumn id="SpotColumn/id/B" />
                    <SpotColumn id="SpotColumn/id/C" />
                    <SpotColumn id="SpotColumn/id/D" />
                    <SpotColumn id="spot_column_1778936952743" />
                  </spotColumns>
                  <deckSpaces>
                    <PassengerSpace id="space_1778949529557" version="1.0">
                      <Name>Main Space</Name>
                      <SmokingAllowed>false</SmokingAllowed>
                      <StandingAllowed>true</StandingAllowed>
                      <PassengerSpaceType>seatingArea</PassengerSpaceType>
                      <passengerSpots>
                        <PassengerSpot id="144" version="1.0">
                          <Label>144</Label>
                          <Orientation>forwards</Orientation>
                          <actualVehicleEquipments />
                          <SpotColumnRef ref="SpotColumn/id/D" version="1.0" />
                          <SpotRowRef ref="SpotRow/id/2" version="1.0" />
                          <Centroid>
                            <Location>
                              <pos>2.1352564102564098 0.585</pos>
                            </Location>
                          </Centroid>
                          <Width>0.35</Width>
                          <Length>0.35</Length>
                        </PassengerSpot>
                        <PassengerSpot id="143" version="1.0">
                          <Label>143</Label>
                          <Orientation>forwards</Orientation>
                          <actualVehicleEquipments />
                          <SpotColumnRef ref="spot_column_1778936952743" version="1.0" />
                          <SpotRowRef ref="SpotRow/id/2" version="1.0" />
                          <IsByWindow>true</IsByWindow>
                          <Centroid>
                            <Location>
                              <pos>2.1352564102564098 0.23</pos>
                            </Location>
                          </Centroid>
                          <Width>0.35</Width>
                          <Length>0.35</Length>
                        </PassengerSpot>
                        <PassengerSpot id="140" version="1.0">
                          <Label>140</Label>
                          <Orientation>forwards</Orientation>
                          <actualVehicleEquipments />
                          <SpotColumnRef ref="SpotColumn/id/D" version="1.0" />
                          <SpotRowRef ref="SpotRow/id/3" version="1.0" />
                          <Centroid>
                            <Location>
                              <pos>2.6804487179487166 0.585</pos>
                            </Location>
                          </Centroid>
                          <Width>0.35</Width>
                          <Length>0.35</Length>
                        </PassengerSpot>
                        <PassengerSpot id="139" version="1.0">
                          <Label>139</Label>
                          <Orientation>forwards</Orientation>
                          <actualVehicleEquipments />
                          <SpotColumnRef ref="spot_column_1778936952743" version="1.0" />
                          <SpotRowRef ref="SpotRow/id/3" version="1.0" />
                          <IsByWindow>true</IsByWindow>
                          <Centroid>
                            <Location>
                              <pos>2.6804487179487166 0.23</pos>
                            </Location>
                          </Centroid>
                          <Width>0.35</Width>
                          <Length>0.35</Length>
                        </PassengerSpot>
                        <PassengerSpot id="141" version="1.0">
                          <Label>141</Label>
                          <Orientation>forwards</Orientation>
                          <actualVehicleEquipments />
                          <SpotColumnRef ref="SpotColumn/id/A" version="1.0" />
                          <SpotRowRef ref="SpotRow/id/3" version="1.0" />
                          <IsByWindow>true</IsByWindow>
                          <Centroid>
                            <Location>
                              <pos>2.6804487179487166 1.775</pos>
                            </Location>
                          </Centroid>
                          <Width>0.35</Width>
                          <Length>0.35</Length>
                        </PassengerSpot>
                        <PassengerSpot id="136" version="1.0">
                          <Label>136</Label>
                          <Orientation>forwards</Orientation>
                          <actualVehicleEquipments />
                          <SpotColumnRef ref="SpotColumn/id/D" version="1.0" />
                          <SpotRowRef ref="SpotRow/id/4" version="1.0" />
                          <Centroid>
                            <Location>
                              <pos>3.2535256410256403 0.585</pos>
                            </Location>
                          </Centroid>
                          <Width>0.35</Width>
                          <Length>0.35</Length>
                        </PassengerSpot>
                        <PassengerSpot id="135" version="1.0">
                          <Label>135</Label>
                          <Orientation>forwards</Orientation>
                          <actualVehicleEquipments />
                          <SpotColumnRef ref="spot_column_1778936952743" version="1.0" />
                          <SpotRowRef ref="SpotRow/id/4" version="1.0" />
                          <IsByWindow>true</IsByWindow>
                          <Centroid>
                            <Location>
                              <pos>3.2535256410256403 0.23</pos>
                            </Location>
                          </Centroid>
                          <Width>0.35</Width>
                          <Length>0.35</Length>
                        </PassengerSpot>
                        <PassengerSpot id="132" version="1.0">
                          <Label>132</Label>
                          <Orientation>forwards</Orientation>
                          <actualVehicleEquipments />
                          <SpotColumnRef ref="SpotColumn/id/D" version="1.0" />
                          <SpotRowRef ref="SpotRow/id/5" version="1.0" />
                          <Centroid>
                            <Location>
                              <pos>3.8573717948717934 0.585</pos>
                            </Location>
                          </Centroid>
                          <Width>0.35</Width>
                          <Length>0.35</Length>
                        </PassengerSpot>
                        <PassengerSpot id="131" version="1.0">
                          <Label>131</Label>
                          <Orientation>forwards</Orientation>
                          <actualVehicleEquipments />
                          <SpotColumnRef ref="spot_column_1778936952743" version="1.0" />
                          <SpotRowRef ref="SpotRow/id/5" version="1.0" />
                          <IsByWindow>true</IsByWindow>
                          <Centroid>
                            <Location>
                              <pos>3.8573717948717934 0.23</pos>
                            </Location>
                          </Centroid>
                          <Width>0.35</Width>
                          <Length>0.35</Length>
                        </PassengerSpot>
                        <PassengerSpot id="128" version="1.0">
                          <Label>128</Label>
                          <Orientation>forwards</Orientation>
                          <actualVehicleEquipments />
                          <SpotColumnRef ref="SpotColumn/id/D" version="1.0" />
                          <SpotRowRef ref="SpotRow/id/6" version="1.0" />
                          <Centroid>
                            <Location>
                              <pos>4.472756410256409 0.585</pos>
                            </Location>
                          </Centroid>
                          <Width>0.35</Width>
                          <Length>0.35</Length>
                        </PassengerSpot>
                        <PassengerSpot id="127" version="1.0">
                          <Label>127</Label>
                          <Orientation>forwards</Orientation>
                          <actualVehicleEquipments />
                          <SpotColumnRef ref="spot_column_1778936952743" version="1.0" />
                          <SpotRowRef ref="SpotRow/id/6" version="1.0" />
                          <IsByWindow>true</IsByWindow>
                          <Centroid>
                            <Location>
                              <pos>4.472756410256409 0.23</pos>
                            </Location>
                          </Centroid>
                          <Width>0.35</Width>
                          <Length>0.35</Length>
                        </PassengerSpot>
                        <PassengerSpot id="137" version="1.0">
                          <Label>137</Label>
                          <Orientation>forwards</Orientation>
                          <actualVehicleEquipments />
                          <SpotColumnRef ref="SpotColumn/id/A" version="1.0" />
                          <SpotRowRef ref="SpotRow/id/4" version="1.0" />
                          <IsByWindow>true</IsByWindow>
                          <Centroid>
                            <Location>
                              <pos>3.2535256410256403 1.775</pos>
                            </Location>
                          </Centroid>
                          <Width>0.35</Width>
                          <Length>0.35</Length>
                        </PassengerSpot>
                        <PassengerSpot id="133" version="1.0">
                          <Label>133</Label>
                          <Orientation>forwards</Orientation>
                          <actualVehicleEquipments />
                          <SpotColumnRef ref="SpotColumn/id/A" version="1.0" />
                          <SpotRowRef ref="SpotRow/id/5" version="1.0" />
                          <IsByWindow>true</IsByWindow>
                          <Centroid>
                            <Location>
                              <pos>3.8573717948717934 1.775</pos>
                            </Location>
                          </Centroid>
                          <Width>0.35</Width>
                          <Length>0.35</Length>
                        </PassengerSpot>
                        <PassengerSpot id="129" version="1.0">
                          <Label>129</Label>
                          <Orientation>forwards</Orientation>
                          <actualVehicleEquipments />
                          <SpotColumnRef ref="SpotColumn/id/A" version="1.0" />
                          <SpotRowRef ref="SpotRow/id/6" version="1.0" />
                          <IsByWindow>true</IsByWindow>
                          <Centroid>
                            <Location>
                              <pos>4.472756410256409 1.775</pos>
                            </Location>
                          </Centroid>
                          <Width>0.35</Width>
                          <Length>0.35</Length>
                        </PassengerSpot>
                        <PassengerSpot id="121" version="1.0">
                          <Label>121</Label>
                          <Orientation>backwards</Orientation>
                          <actualVehicleEquipments />
                          <SpotColumnRef ref="SpotColumn/id/A" version="1.0" />
                          <SpotRowRef ref="SpotRow/id/9" version="1.0" />
                          <IsByWindow>true</IsByWindow>
                          <Centroid>
                            <Location>
                              <pos>5.84775641025641 1.775</pos>
                            </Location>
                          </Centroid>
                          <Width>0.35</Width>
                          <Length>0.35</Length>
                        </PassengerSpot>
                        <PassengerSpot id="120" version="1.0">
                          <Label>120</Label>
                          <Orientation>backwards</Orientation>
                          <actualVehicleEquipments />
                          <SpotColumnRef ref="SpotColumn/id/D" version="1.0" />
                          <SpotRowRef ref="SpotRow/id/9" version="1.0" />
                          <Centroid>
                            <Location>
                              <pos>5.84775641025641 0.585</pos>
                            </Location>
                          </Centroid>
                          <Width>0.35</Width>
                          <Length>0.35</Length>
                        </PassengerSpot>
                        <PassengerSpot id="119" version="1.0">
                          <Label>119</Label>
                          <Orientation>backwards</Orientation>
                          <actualVehicleEquipments />
                          <SpotColumnRef ref="spot_column_1778936952743" version="1.0" />
                          <SpotRowRef ref="SpotRow/id/9" version="1.0" />
                          <IsByWindow>true</IsByWindow>
                          <Centroid>
                            <Location>
                              <pos>5.84775641025641 0.23</pos>
                            </Location>
                          </Centroid>
                          <Width>0.35</Width>
                          <Length>0.35</Length>
                        </PassengerSpot>
                        <PassengerSpot id="116" version="1.0">
                          <Label>116</Label>
                          <Orientation>backwards</Orientation>
                          <actualVehicleEquipments />
                          <SpotColumnRef ref="SpotColumn/id/D" version="1.0" />
                          <SpotRowRef ref="SpotRow/id/10" version="1.0" />
                          <Centroid>
                            <Location>
                              <pos>6.451602564102564 0.585</pos>
                            </Location>
                          </Centroid>
                          <Width>0.35</Width>
                          <Length>0.35</Length>
                        </PassengerSpot>
                        <PassengerSpot id="115" version="1.0">
                          <Label>115</Label>
                          <Orientation>backwards</Orientation>
                          <actualVehicleEquipments />
                          <SpotColumnRef ref="spot_column_1778936952743" version="1.0" />
                          <SpotRowRef ref="SpotRow/id/10" version="1.0" />
                          <IsByWindow>true</IsByWindow>
                          <Centroid>
                            <Location>
                              <pos>6.451602564102564 0.23</pos>
                            </Location>
                          </Centroid>
                          <Width>0.35</Width>
                          <Length>0.35</Length>
                        </PassengerSpot>
                        <PassengerSpot id="117" version="1.0">
                          <Label>117</Label>
                          <Orientation>backwards</Orientation>
                          <actualVehicleEquipments />
                          <SpotColumnRef ref="SpotColumn/id/A" version="1.0" />
                          <SpotRowRef ref="SpotRow/id/10" version="1.0" />
                          <IsByWindow>true</IsByWindow>
                          <Centroid>
                            <Location>
                              <pos>6.451602564102564 1.775</pos>
                            </Location>
                          </Centroid>
                          <Width>0.35</Width>
                          <Length>0.35</Length>
                        </PassengerSpot>
                        <PassengerSpot id="113" version="1.0">
                          <Label>113</Label>
                          <Orientation>backwards</Orientation>
                          <actualVehicleEquipments />
                          <SpotColumnRef ref="SpotColumn/id/A" version="1.0" />
                          <SpotRowRef ref="SpotRow/id/11" version="1.0" />
                          <IsByWindow>true</IsByWindow>
                          <Centroid>
                            <Location>
                              <pos>7.026602564102564 1.775</pos>
                            </Location>
                          </Centroid>
                          <Width>0.35</Width>
                          <Length>0.35</Length>
                        </PassengerSpot>
                        <PassengerSpot id="109" version="1.0">
                          <Label>109</Label>
                          <Orientation>backwards</Orientation>
                          <actualVehicleEquipments />
                          <SpotColumnRef ref="SpotColumn/id/A" version="1.0" />
                          <SpotRowRef ref="spot_row_1778936985294" version="1.0" />
                          <IsByWindow>true</IsByWindow>
                          <Centroid>
                            <Location>
                              <pos>7.589102564102564 1.775</pos>
                            </Location>
                          </Centroid>
                          <Width>0.35</Width>
                          <Length>0.35</Length>
                        </PassengerSpot>
                        <PassengerSpot id="103" version="1.0">
                          <Label>103</Label>
                          <Orientation>backwards</Orientation>
                          <actualVehicleEquipments />
                          <SpotColumnRef ref="SpotColumn/id/A" version="1.0" />
                          <SpotRowRef ref="spot_row_1778936986382" version="1.0" />
                          <IsByWindow>true</IsByWindow>
                          <Centroid>
                            <Location>
                              <pos>8.208333333333334 1.775</pos>
                            </Location>
                          </Centroid>
                          <Width>0.35</Width>
                          <Length>0.35</Length>
                        </PassengerSpot>
                        <PassengerSpot id="112" version="1.0">
                          <Label>112</Label>
                          <Orientation>backwards</Orientation>
                          <actualVehicleEquipments />
                          <SpotColumnRef ref="SpotColumn/id/D" version="1.0" />
                          <SpotRowRef ref="SpotRow/id/11" version="1.0" />
                          <Centroid>
                            <Location>
                              <pos>7.026602564102564 0.585</pos>
                            </Location>
                          </Centroid>
                          <Width>0.35</Width>
                          <Length>0.35</Length>
                        </PassengerSpot>
                        <PassengerSpot id="111" version="1.0">
                          <Label>111</Label>
                          <Orientation>backwards</Orientation>
                          <actualVehicleEquipments />
                          <SpotColumnRef ref="spot_column_1778936952743" version="1.0" />
                          <SpotRowRef ref="SpotRow/id/11" version="1.0" />
                          <IsByWindow>true</IsByWindow>
                          <Centroid>
                            <Location>
                              <pos>7.026602564102564 0.23</pos>
                            </Location>
                          </Centroid>
                          <Width>0.35</Width>
                          <Length>0.35</Length>
                        </PassengerSpot>
                        <PassengerSpot id="108" version="1.0">
                          <Label>108</Label>
                          <Orientation>backwards</Orientation>
                          <actualVehicleEquipments />
                          <SpotColumnRef ref="SpotColumn/id/D" version="1.0" />
                          <SpotRowRef ref="spot_row_1778936985294" version="1.0" />
                          <Centroid>
                            <Location>
                              <pos>7.589102564102564 0.585</pos>
                            </Location>
                          </Centroid>
                          <Width>0.35</Width>
                          <Length>0.35</Length>
                        </PassengerSpot>
                        <PassengerSpot id="107" version="1.0">
                          <Label>107</Label>
                          <Orientation>backwards</Orientation>
                          <actualVehicleEquipments />
                          <SpotColumnRef ref="spot_column_1778936952743" version="1.0" />
                          <SpotRowRef ref="spot_row_1778936985294" version="1.0" />
                          <IsByWindow>true</IsByWindow>
                          <Centroid>
                            <Location>
                              <pos>7.589102564102564 0.23</pos>
                            </Location>
                          </Centroid>
                          <Width>0.35</Width>
                          <Length>0.35</Length>
                        </PassengerSpot>
                        <PassengerSpot id="106" version="1.0">
                          <Label>106</Label>
                          <Orientation>backwards</Orientation>
                          <actualVehicleEquipments />
                          <SpotColumnRef ref="SpotColumn/id/D" version="1.0" />
                          <SpotRowRef ref="spot_row_1778936986382" version="1.0" />
                          <Centroid>
                            <Location>
                              <pos>8.208333333333334 0.585</pos>
                            </Location>
                          </Centroid>
                          <Width>0.35</Width>
                          <Length>0.35</Length>
                        </PassengerSpot>
                        <PassengerSpot id="105" version="1.0">
                          <Label>105</Label>
                          <Orientation>backwards</Orientation>
                          <actualVehicleEquipments />
                          <SpotColumnRef ref="spot_column_1778936952743" version="1.0" />
                          <SpotRowRef ref="spot_row_1778936986382" version="1.0" />
                          <IsByWindow>true</IsByWindow>
                          <Centroid>
                            <Location>
                              <pos>8.208333333333334 0.23</pos>
                            </Location>
                          </Centroid>
                          <Width>0.35</Width>
                          <Length>0.35</Length>
                        </PassengerSpot>
                        <PassengerSpot id="101" version="1.0">
                          <Label>101</Label>
                          <Orientation>backwards</Orientation>
                          <actualVehicleEquipments />
                          <SpotColumnRef ref="spot_column_1778936952743" version="1.0" />
                          <SpotRowRef ref="spot_row_1778936986822" version="1.0" />
                          <IsByWindow>true</IsByWindow>
                          <Centroid>
                            <Location>
                              <pos>8.733333333333336 0.23</pos>
                            </Location>
                          </Centroid>
                          <Width>0.35</Width>
                          <Length>0.35</Length>
                        </PassengerSpot>
                        <PassengerSpot id="102" version="1.0">
                          <Label>102</Label>
                          <Orientation>backwards</Orientation>
                          <actualVehicleEquipments />
                          <SpotColumnRef ref="SpotColumn/id/D" version="1.0" />
                          <SpotRowRef ref="spot_row_1778936986822" version="1.0" />
                          <Centroid>
                            <Location>
                              <pos>8.733333333333336 0.585</pos>
                            </Location>
                          </Centroid>
                          <Width>0.35</Width>
                          <Length>0.35</Length>
                        </PassengerSpot>
                        <PassengerSpot id="125" version="1.0">
                          <Label>125</Label>
                          <Orientation>forwards</Orientation>
                          <actualVehicleEquipments />
                          <SpotColumnRef ref="SpotColumn/id/A" version="1.0" />
                          <SpotRowRef ref="SpotRow/id/7" version="1.0" />
                          <IsByWindow>true</IsByWindow>
                          <Centroid>
                            <Location>
                              <pos>5.058333333333334 1.775</pos>
                            </Location>
                          </Centroid>
                          <Width>0.35</Width>
                          <Length>0.35</Length>
                        </PassengerSpot>
                        <PassengerSpot id="124" version="1.0">
                          <Label>124</Label>
                          <Orientation>forwards</Orientation>
                          <actualVehicleEquipments />
                          <SpotColumnRef ref="SpotColumn/id/D" version="1.0" />
                          <SpotRowRef ref="SpotRow/id/7" version="1.0" />
                          <Centroid>
                            <Location>
                              <pos>5.058333333333334 0.585</pos>
                            </Location>
                          </Centroid>
                          <Width>0.35</Width>
                          <Length>0.35</Length>
                        </PassengerSpot>
                        <PassengerSpot id="123" version="1.0">
                          <Label>123</Label>
                          <Orientation>forwards</Orientation>
                          <actualVehicleEquipments />
                          <SpotColumnRef ref="spot_column_1778936952743" version="1.0" />
                          <SpotRowRef ref="SpotRow/id/7" version="1.0" />
                          <IsByWindow>true</IsByWindow>
                          <Centroid>
                            <Location>
                              <pos>5.058333333333334 0.23</pos>
                            </Location>
                          </Centroid>
                          <Width>0.35</Width>
                          <Length>0.35</Length>
                        </PassengerSpot>
                      </passengerSpots>
                      <luggageSpots />
                      <deckEntrances>
                        <PassengerEntrance id="entrance_1778950926855" version="1.0">
                          <actualVehicleEquipments />
                          <Centroid>
                            <Location>
                              <pos>0.3111111111111111 1.946667</pos>
                            </Location>
                          </Centroid>
                        </PassengerEntrance>
                        <PassengerEntrance id="entrance_1778950928595" version="1.0">
                          <actualVehicleEquipments />
                          <Centroid>
                            <Location>
                              <pos>12.2 1.977778</pos>
                            </Location>
                          </Centroid>
                        </PassengerEntrance>
                        <PassengerEntrance id="entrance_1778950938091" version="1.0">
                          <actualVehicleEquipments />
                          <Centroid>
                            <Location>
                              <pos>0.29111111111111115 0.037778</pos>
                            </Location>
                          </Centroid>
                        </PassengerEntrance>
                        <PassengerEntrance id="entrance_1778950940714" version="1.0">
                          <actualVehicleEquipments />
                          <Centroid>
                            <Location>
                              <pos>12.2 0.022222</pos>
                            </Location>
                          </Centroid>
                        </PassengerEntrance>
                      </deckEntrances>
                      <deckEntranceUsage />
                      <deckEntranceCouples />
                      <deckSpaceCapacities />
                      <actualVehicleEquipments />
                      <FareClass>Best</FareClass>
                    </PassengerSpace>
                    <PassengerSpace id="seating-area_1778951084721" version="1.0">
                      <Name>Lounge</Name>
                      <PassengerSpaceType>seatingArea</PassengerSpaceType>
                      <passengerSpots>
                        <PassengerSpot id="171" version="1.0">
                          <Label>171</Label>
                          <Orientation>forwards</Orientation>
                          <actualVehicleEquipments />
                          <SpotColumnRef ref="spot_column_1778936952743" version="1.0" />
                          <SpotRowRef ref="spot_row_1778936987173" version="1.0" />
                          <IsByWindow>true</IsByWindow>
                          <Centroid>
                            <Location>
                              <pos>9.183333333333334 0.23</pos>
                            </Location>
                          </Centroid>
                          <Width>0.35</Width>
                          <Length>0.35</Length>
                        </PassengerSpot>
                        <PassengerSpot id="172" version="1.0">
                          <Label>172</Label>
                          <Orientation>forwards</Orientation>
                          <actualVehicleEquipments />
                          <SpotColumnRef ref="SpotColumn/id/D" version="1.0" />
                          <SpotRowRef ref="spot_row_1778936987173" version="1.0" />
                          <Centroid>
                            <Location>
                              <pos>9.183333333333334 0.585</pos>
                            </Location>
                          </Centroid>
                          <Width>0.35</Width>
                          <Length>0.35</Length>
                        </PassengerSpot>
                        <PassengerSpot id="174" version="1.0">
                          <Label>174</Label>
                          <Orientation>forwards</Orientation>
                          <actualVehicleEquipments />
                          <SpotColumnRef ref="SpotColumn/id/C" version="1.0" />
                          <SpotRowRef ref="spot_row_1778936987173" version="1.0" />
                          <Centroid>
                            <Location>
                              <pos>9.183333333333334 0.925</pos>
                            </Location>
                          </Centroid>
                          <Width>0.35</Width>
                          <Length>0.35</Length>
                        </PassengerSpot>
                        <PassengerSpot id="175" version="1.0">
                          <Label>175</Label>
                          <Orientation>leftwards</Orientation>
                          <actualVehicleEquipments />
                          <SpotColumnRef ref="spot_column_1778936952743" version="1.0" />
                          <SpotRowRef ref="spot_row_1778936988038" version="1.0" />
                          <Centroid>
                            <Location>
                              <pos>9.795833333333336 0.23</pos>
                            </Location>
                          </Centroid>
                          <Width>0.35</Width>
                          <Length>0.35</Length>
                        </PassengerSpot>
                        <PassengerSpot id="176" version="1.0">
                          <Label>176</Label>
                          <Orientation>leftwards</Orientation>
                          <actualVehicleEquipments />
                          <SpotColumnRef ref="spot_column_1778936952743" version="1.0" />
                          <SpotRowRef ref="spot_row_1778936988454" version="1.0" />
                          <Centroid>
                            <Location>
                              <pos>10.145833333333336 0.23</pos>
                            </Location>
                          </Centroid>
                          <Width>0.35</Width>
                          <Length>0.35</Length>
                        </PassengerSpot>
                        <PassengerSpot id="177" version="1.0">
                          <Label>177</Label>
                          <Orientation>leftwards</Orientation>
                          <actualVehicleEquipments />
                          <SpotColumnRef ref="spot_column_1778936952743" version="1.0" />
                          <SpotRowRef ref="spot_row_1778936988839" version="1.0" />
                          <Centroid>
                            <Location>
                              <pos>10.570833333333335 0.23</pos>
                            </Location>
                          </Centroid>
                          <Width>0.35</Width>
                          <Length>0.35</Length>
                        </PassengerSpot>
                        <PassengerSpot id="178" version="1.0">
                          <Label>178</Label>
                          <Orientation>leftwards</Orientation>
                          <actualVehicleEquipments />
                          <SpotColumnRef ref="spot_column_1778936952743" version="1.0" />
                          <SpotRowRef ref="spot_row_1778936989382" version="1.0" />
                          <Centroid>
                            <Location>
                              <pos>10.933333333333334 0.23</pos>
                            </Location>
                          </Centroid>
                          <Width>0.35</Width>
                          <Length>0.35</Length>
                        </PassengerSpot>
                        <PassengerSpot id="179" version="1.0">
                          <Label>179</Label>
                          <Orientation>backwards</Orientation>
                          <actualVehicleEquipments />
                          <SpotColumnRef ref="spot_column_1778936952743" version="1.0" />
                          <SpotRowRef ref="spot_row_1778949629523" version="1.0" />
                          <IsByWindow>true</IsByWindow>
                          <Centroid>
                            <Location>
                              <pos>11.58 0.23</pos>
                            </Location>
                          </Centroid>
                          <Width>0.35</Width>
                          <Length>0.35</Length>
                        </PassengerSpot>
                        <PassengerSpot id="180" version="1.0">
                          <Label>180</Label>
                          <Orientation>backwards</Orientation>
                          <actualVehicleEquipments />
                          <SpotColumnRef ref="SpotColumn/id/D" version="1.0" />
                          <SpotRowRef ref="spot_row_1778949629523" version="1.0" />
                          <Centroid>
                            <Location>
                              <pos>11.58 0.585</pos>
                            </Location>
                          </Centroid>
                          <Width>0.35</Width>
                          <Length>0.35</Length>
                        </PassengerSpot>
                        <PassengerSpot id="182" version="1.0">
                          <Label>182</Label>
                          <Orientation>backwards</Orientation>
                          <actualVehicleEquipments />
                          <SpotColumnRef ref="SpotColumn/id/C" version="1.0" />
                          <SpotRowRef ref="spot_row_1778949629523" version="1.0" />
                          <Centroid>
                            <Location>
                              <pos>11.58 0.925</pos>
                            </Location>
                          </Centroid>
                          <Width>0.35</Width>
                          <Length>0.35</Length>
                        </PassengerSpot>
                        <PassengerSpot id="184" version="1.0">
                          <Label>184</Label>
                          <Orientation>rightwards</Orientation>
                          <actualVehicleEquipments />
                          <SpotColumnRef ref="SpotColumn/id/C" version="1.0" />
                          <SpotRowRef ref="spot_row_1778936988454" version="1.0" />
                          <Centroid>
                            <Location>
                              <pos>10.703333333333337 0.925</pos>
                            </Location>
                          </Centroid>
                          <Width>0.35</Width>
                          <Length>0.35</Length>
                        </PassengerSpot>
                        <PassengerSpot id="183" version="1.0">
                          <Label>183</Label>
                          <Orientation>rightwards</Orientation>
                          <actualVehicleEquipments />
                          <SpotColumnRef ref="SpotColumn/id/C" version="1.0" />
                          <SpotRowRef ref="spot_row_1778936988839" version="1.0" />
                          <Centroid>
                            <Location>
                              <pos>10.323333333333336 0.925</pos>
                            </Location>
                          </Centroid>
                          <Width>0.35</Width>
                          <Length>0.35</Length>
                        </PassengerSpot>
                      </passengerSpots>
                      <luggageSpots />
                      <deckEntrances />
                      <deckEntranceUsage />
                      <deckEntranceCouples />
                      <deckSpaceCapacities />
                      <actualVehicleEquipments />
                      <FareClass>Best</FareClass>
                    </PassengerSpace>
                  </deckSpaces>
                  <DeckLevelRef ref="deck_level_0" version="1.0" />
                  <Name />
                  <Width>2</Width>
                  <Length>13</Length>
                </Deck>
              </decks>
              <deckLevels>
                <DeckLevel id="deck_level_0" version="1.0">
                  <Label>Level 0</Label>
                </DeckLevel>
              </deckLevels>
            </DeckPlan>
          </deckPlans>
          <schematicMaps>
            <SchematicMap>
              <Name>Talent 3 seat map</Name>
              <ImageUri>https://www.example.com</ImageUri>
              <DepictedObjectRef ref="Train/id/1" />
            </SchematicMap>
          </schematicMaps>
        </ResourceFrame>
      </frames>
    </CompositeFrame>
  </dataObjects>
</PublicationDelivery>`})),$n,er=e((()=>{$n=`<?xml version='1.0' encoding='utf-8'?>
<PublicationDelivery version="1.2.2" schemaLocation="http://www.netex.org.uk/netex file:///home/robin/Projekte/NeTEx/xsd/NeTEx_publication.xsd">
  <PublicationTimestamp>2020-12-17T09:30:47.0Z</PublicationTimestamp>
  <ParticipantRef>SYS001</ParticipantRef>
  <dataObjects>
    <CompositeFrame version="any" id="CompositeFrame/id/1">
      <frames>
        <ResourceFrame version="any" id="ResourceFrame/id/1">
          <equipments>
            <AccessVehicleEquipment id="AccessVehicleEquipment/id/1" version="any">
              <Name>Ramp</Name>
              <Fixed>false</Fixed>
              <LowFloor>false</LowFloor>
              <HighFloor>false</HighFloor>
              <Ramp>true</Ramp>
            </AccessVehicleEquipment>
            <AccessVehicleEquipment id="AccessVehicleEquipment/id/2" version="any">
              <Name>Lift</Name>
              <Fixed>false</Fixed>
              <LowFloor>false</LowFloor>
              <HighFloor>false</HighFloor>
              <Ramp>false</Ramp>
            </AccessVehicleEquipment>
            <AccessVehicleEquipment id="AccessVehicleEquipment/id/3" version="any">
              <Name>Entrance dimensions</Name>
              <Fixed>false</Fixed>
              <LowFloor>false</LowFloor>
              <HighFloor>false</HighFloor>
              <Ramp>false</Ramp>
            </AccessVehicleEquipment>
          </equipments>
          <serviceFacilitySets>
            <ServiceFacilitySet version="any" id="ServiceFacilityTrain">
              <PassengerInformationFacilityList>nextStopIndicator

                stopAnnouncements</PassengerInformationFacilityList>
              <SanitaryFacilityList>toilet
                wheelchairAccessToilet</SanitaryFacilityList>
              <TicketingFacilityList />
            </ServiceFacilitySet>
            <ServiceFacilitySet version="any" id="ServiceFacilityQuiet">
              <NuisanceFacilityList>mobilePhoneFreeZone</NuisanceFacilityList>
            </ServiceFacilitySet>
          </serviceFacilitySets>
          <vehicleTypes>
            <Train version="any" id="Train/id/1">
              <Name>Talent 3</Name>
              <Description>4 Teiler</Description>
              <ReversingDirection>true</ReversingDirection>
              <SelfPropelled>true</SelfPropelled>
              <PropulsionType>electric</PropulsionType>
              <TransportMode>rail</TransportMode>
              <capacities>
                <PassengerCapacity version="any" id="PassengerCapacity/id/1">
                  <FareClass>firstClass</FareClass>
                  <SeatingCapacity>8</SeatingCapacity>
                </PassengerCapacity>
                <PassengerCapacity version="any" id="PassengerCapacity/id/2">
                  <FareClass>secondClass</FareClass>
                  <SeatingCapacity>207</SeatingCapacity>
                  <StandingCapacity>275</StandingCapacity>
                  <WheelchairPlaceCapacity>2</WheelchairPlaceCapacity>
                  <BicycleRackCapacity>33</BicycleRackCapacity>
                </PassengerCapacity>
              </capacities>
              <LowFloor>false</LowFloor>
              <HasLiftOrRamp>true</HasLiftOrRamp>
              <BoardingHeight>0.6</BoardingHeight>
              <Length>72.3</Length>
              <Width>2.926</Width>
              <Height>4.26</Height>
              <facilities>
                <ServiceFacilitySetRef version="any" ref="ServiceFacilityTrain" />
              </facilities>
              <components>
                <TrainComponent version="any" id="TrainComponent/id/1">
                  <Label>201-3</Label>
                  <TractiveElementTypeRef version="any" ref="TractiveElementType/id/T3-1" />
                  <OperationalOrientation>forwards</OperationalOrientation>
                  <ForwardCoupling>
                    <Splittable>true</Splittable>
                    <ThroughAccess>noThroughAccess</ThroughAccess>
                  </ForwardCoupling>
                </TrainComponent>
                <TrainComponent version="any" id="TrainComponent/id/2">
                  <Label>201-8</Label>
                  <TrailingElementTypeRef version="any" ref="TrailingElementType/id/M3-1" />
                  <OperationalOrientation>forwards</OperationalOrientation>
                  <ForwardCoupling>
                    <Splittable>true</Splittable>
                    <ThroughAccess>openEntrance</ThroughAccess>
                  </ForwardCoupling>
                </TrainComponent>
                <TrainComponent version="any" id="TrainComponent/id/3">
                  <Label>701-7</Label>
                  <TrailingElementTypeRef version="any" ref="TrailingElementType/id/M2-1" />
                  <OperationalOrientation>forwards</OperationalOrientation>
                  <ForwardCoupling>
                    <Splittable>true</Splittable>
                    <ThroughAccess>openEntrance</ThroughAccess>
                  </ForwardCoupling>
                </TrainComponent>
                <TrainComponent version="any" id="TrainComponent/id/4">
                  <Label>701-9</Label>
                  <TractiveElementTypeRef version="any" ref="TractiveElementType/id/T2-1" />
                  <OperationalOrientation>forwards</OperationalOrientation>
                  <ForwardCoupling>
                    <Splittable>true</Splittable>
                    <ThroughAccess>openEntrance</ThroughAccess>
                  </ForwardCoupling>
                </TrainComponent>
              </components>
            </Train>
          </vehicleTypes>
          <trainElementTypes>
            <TractiveElementType version="any" id="TractiveElementType/id/T3-1">
              <Name>T3-1</Name>
              <TrainElementType>engine</TrainElementType>
              <Length>20.05</Length>
              <Width>2.926</Width>
              <Height>4.26</Height>
              <DeckPlanRef version="any" ref="DeckPlan/id/1" />
            </TractiveElementType>
            <TractiveElementType version="any" id="TractiveElementType/id/T2-1">
              <Name>T2-1</Name>
              <TrainElementType>engine</TrainElementType>
              <Length>20.05</Length>
              <Width>2.926</Width>
              <Height>4.26</Height>
            </TractiveElementType>
            <TrailingElementType version="any" id="TrailingElementType/id/M3-1">
              <Name>M3-1</Name>
              <TrainElementType>carriage</TrainElementType>
              <Length>16.1</Length>
              <Width>2.926</Width>
              <Height>4.26</Height>
            </TrailingElementType>
            <TrailingElementType version="any" id="TrailingElementType/id/M2-1">
              <Name>M2-1</Name>
              <TrainElementType>carriage</TrainElementType>
              <Length>16.1</Length>
              <Width>2.926</Width>
              <Height>4.26</Height>
            </TrailingElementType>
          </trainElementTypes>
          <deckPlans>
            <DeckPlan id="DeckPlan/id/1" version="any">
              <xmlTagName />
              <decks>
                <Deck id="Deck/id/1" version="any">
                  <spotRows>
                    <SpotRow id="SpotRow/id/1" />
                    <SpotRow id="SpotRow/id/2" />
                    <SpotRow id="SpotRow/id/3" />
                    <SpotRow id="SpotRow/id/4" />
                    <SpotRow id="SpotRow/id/5" />
                    <SpotRow id="SpotRow/id/6" />
                    <SpotRow id="SpotRow/id/7" />
                    <SpotRow id="SpotRow/id/8" />
                    <SpotRow id="SpotRow/id/9" />
                    <SpotRow id="SpotRow/id/10" />
                    <SpotRow id="SpotRow/id/11" />
                    <SpotRow id="spot_row_1778936985294" />
                    <SpotRow id="spot_row_1778936986382" />
                    <SpotRow id="spot_row_1778936986822" />
                    <SpotRow id="spot_row_1778936987173" />
                    <SpotRow id="spot_row_1778936987614" />
                    <SpotRow id="spot_row_1778936988038" />
                    <SpotRow id="spot_row_1778936988454" />
                    <SpotRow id="spot_row_1778936988839" />
                  </spotRows>
                  <spotColumns>
                    <SpotColumn id="SpotColumn/id/A" />
                    <SpotColumn id="SpotColumn/id/B" />
                    <SpotColumn id="SpotColumn/id/C" />
                    <SpotColumn id="SpotColumn/id/D" />
                    <SpotColumn id="spot_column_1778936952743" />
                  </spotColumns>
                  <deckSpaces>
                    <PassengerSpace id="space_1778949529557" version="1.0">
                      <Name>Main Space</Name>
                      <SmokingAllowed>false</SmokingAllowed>
                      <StandingAllowed>true</StandingAllowed>
                      <PassengerSpaceType>seatingArea</PassengerSpaceType>
                      <passengerSpots>
                        <PassengerSpot id="6" version="1.0">
                          <Label>6</Label>
                          <Orientation>forwards</Orientation>
                          <actualVehicleEquipments />
                          <SpotColumnRef ref="SpotColumn/id/D" version="1.0" />
                          <SpotRowRef ref="SpotRow/id/1" version="1.0" />
                          <Centroid>
                            <Location>
                              <pos>1.575 1.388462</pos>
                            </Location>
                          </Centroid>
                          <Width>0.35</Width>
                          <Length>0.35</Length>
                        </PassengerSpot>
                        <PassengerSpot id="5" version="1.0">
                          <Label>5</Label>
                          <Orientation>forwards</Orientation>
                          <actualVehicleEquipments />
                          <SpotColumnRef ref="spot_column_1778936952743" version="1.0" />
                          <SpotRowRef ref="SpotRow/id/1" version="1.0" />
                          <IsByWindow>true</IsByWindow>
                          <Centroid>
                            <Location>
                              <pos>1.575 1.757692</pos>
                            </Location>
                          </Centroid>
                          <Width>0.35</Width>
                          <Length>0.35</Length>
                        </PassengerSpot>
                        <PassengerSpot id="1" version="1.0">
                          <Label>1</Label>
                          <Orientation>forwards</Orientation>
                          <actualVehicleEquipments />
                          <SpotColumnRef ref="SpotColumn/id/A" version="1.0" />
                          <SpotRowRef ref="SpotRow/id/1" version="1.0" />
                          <IsByWindow>true</IsByWindow>
                          <Centroid>
                            <Location>
                              <pos>1.575 0.251923</pos>
                            </Location>
                          </Centroid>
                          <Width>0.35</Width>
                          <Length>0.35</Length>
                        </PassengerSpot>
                        <PassengerSpot id="2" version="1.0">
                          <Label>2</Label>
                          <Orientation>forwards</Orientation>
                          <actualVehicleEquipments />
                          <SpotColumnRef ref="SpotColumn/id/B" version="1.0" />
                          <SpotRowRef ref="SpotRow/id/1" version="1.0" />
                          <Centroid>
                            <Location>
                              <pos>1.575 0.621154</pos>
                            </Location>
                          </Centroid>
                          <Width>0.35</Width>
                          <Length>0.35</Length>
                        </PassengerSpot>
                        <PassengerSpot id="9" version="1.0">
                          <Label>9</Label>
                          <Orientation>forwards</Orientation>
                          <actualVehicleEquipments />
                          <SpotColumnRef ref="SpotColumn/id/A" version="1.0" />
                          <SpotRowRef ref="SpotRow/id/3" version="1.0" />
                          <IsByWindow>true</IsByWindow>
                          <Centroid>
                            <Location>
                              <pos>2.7134615384615377 0.251923</pos>
                            </Location>
                          </Centroid>
                          <Width>0.35</Width>
                          <Length>0.35</Length>
                        </PassengerSpot>
                        <PassengerSpot id="10" version="1.0">
                          <Label>10</Label>
                          <Orientation>forwards</Orientation>
                          <actualVehicleEquipments />
                          <SpotColumnRef ref="SpotColumn/id/B" version="1.0" />
                          <SpotRowRef ref="SpotRow/id/3" version="1.0" />
                          <Centroid>
                            <Location>
                              <pos>2.7134615384615377 0.621154</pos>
                            </Location>
                          </Centroid>
                          <Width>0.35</Width>
                          <Length>0.35</Length>
                        </PassengerSpot>
                        <PassengerSpot id="14" version="1.0">
                          <Label>14</Label>
                          <Orientation>forwards</Orientation>
                          <actualVehicleEquipments />
                          <SpotColumnRef ref="SpotColumn/id/D" version="1.0" />
                          <SpotRowRef ref="SpotRow/id/3" version="1.0" />
                          <Centroid>
                            <Location>
                              <pos>2.7134615384615377 1.388462</pos>
                            </Location>
                          </Centroid>
                          <Width>0.35</Width>
                          <Length>0.35</Length>
                        </PassengerSpot>
                        <PassengerSpot id="13" version="1.0">
                          <Label>13</Label>
                          <Orientation>forwards</Orientation>
                          <actualVehicleEquipments />
                          <SpotColumnRef ref="spot_column_1778936952743" version="1.0" />
                          <SpotRowRef ref="SpotRow/id/3" version="1.0" />
                          <IsByWindow>true</IsByWindow>
                          <Centroid>
                            <Location>
                              <pos>2.713461538461538 1.757692</pos>
                            </Location>
                          </Centroid>
                          <Width>0.35</Width>
                          <Length>0.35</Length>
                        </PassengerSpot>
                        <PassengerSpot id="17" version="1.0">
                          <Label>17</Label>
                          <Orientation>forwards</Orientation>
                          <actualVehicleEquipments />
                          <SpotColumnRef ref="SpotColumn/id/A" version="1.0" />
                          <SpotRowRef ref="SpotRow/id/5" version="1.0" />
                          <IsByWindow>true</IsByWindow>
                          <Centroid>
                            <Location>
                              <pos>3.944230769230769 0.251923</pos>
                            </Location>
                          </Centroid>
                          <Width>0.35</Width>
                          <Length>0.35</Length>
                        </PassengerSpot>
                        <PassengerSpot id="18" version="1.0">
                          <Label>18</Label>
                          <Orientation>forwards</Orientation>
                          <actualVehicleEquipments />
                          <SpotColumnRef ref="SpotColumn/id/B" version="1.0" />
                          <SpotRowRef ref="SpotRow/id/5" version="1.0" />
                          <Centroid>
                            <Location>
                              <pos>3.944230769230769 0.621154</pos>
                            </Location>
                          </Centroid>
                          <Width>0.35</Width>
                          <Length>0.35</Length>
                        </PassengerSpot>
                        <PassengerSpot id="22" version="1.0">
                          <Label>22</Label>
                          <Orientation>forwards</Orientation>
                          <actualVehicleEquipments />
                          <SpotColumnRef ref="SpotColumn/id/D" version="1.0" />
                          <SpotRowRef ref="SpotRow/id/5" version="1.0" />
                          <Centroid>
                            <Location>
                              <pos>3.944230769230769 1.388462</pos>
                            </Location>
                          </Centroid>
                          <Width>0.35</Width>
                          <Length>0.35</Length>
                        </PassengerSpot>
                        <PassengerSpot id="21" version="1.0">
                          <Label>21</Label>
                          <Orientation>forwards</Orientation>
                          <actualVehicleEquipments />
                          <SpotColumnRef ref="spot_column_1778936952743" version="1.0" />
                          <SpotRowRef ref="SpotRow/id/5" version="1.0" />
                          <IsByWindow>true</IsByWindow>
                          <Centroid>
                            <Location>
                              <pos>3.944230769230769 1.757692</pos>
                            </Location>
                          </Centroid>
                          <Width>0.35</Width>
                          <Length>0.35</Length>
                        </PassengerSpot>
                        <PassengerSpot id="25" version="1.0">
                          <Label>25</Label>
                          <Orientation>forwards</Orientation>
                          <actualVehicleEquipments />
                          <SpotColumnRef ref="SpotColumn/id/A" version="1.0" />
                          <SpotRowRef ref="SpotRow/id/7" version="1.0" />
                          <IsByWindow>true</IsByWindow>
                          <Centroid>
                            <Location>
                              <pos>5.128846153846154 0.251923</pos>
                            </Location>
                          </Centroid>
                          <Width>0.35</Width>
                          <Length>0.35</Length>
                        </PassengerSpot>
                        <PassengerSpot id="26" version="1.0">
                          <Label>26</Label>
                          <Orientation>forwards</Orientation>
                          <actualVehicleEquipments />
                          <SpotColumnRef ref="SpotColumn/id/B" version="1.0" />
                          <SpotRowRef ref="SpotRow/id/7" version="1.0" />
                          <Centroid>
                            <Location>
                              <pos>5.128846153846154 0.621154</pos>
                            </Location>
                          </Centroid>
                          <Width>0.35</Width>
                          <Length>0.35</Length>
                        </PassengerSpot>
                        <PassengerSpot id="30" version="1.0">
                          <Label>30</Label>
                          <Orientation>forwards</Orientation>
                          <actualVehicleEquipments />
                          <SpotColumnRef ref="SpotColumn/id/D" version="1.0" />
                          <SpotRowRef ref="SpotRow/id/7" version="1.0" />
                          <IsByWindow>true</IsByWindow>
                          <Centroid>
                            <Location>
                              <pos>5.128846153846154 1.757692</pos>
                            </Location>
                          </Centroid>
                          <Width>0.35</Width>
                          <Length>0.35</Length>
                        </PassengerSpot>
                        <PassengerSpot id="29" version="1.0">
                          <Label>29</Label>
                          <Orientation>forwards</Orientation>
                          <actualVehicleEquipments />
                          <SpotColumnRef ref="spot_column_1778936952743" version="1.0" />
                          <SpotRowRef ref="SpotRow/id/7" version="1.0" />
                          <Centroid>
                            <Location>
                              <pos>5.128846153846154 1.388462</pos>
                            </Location>
                          </Centroid>
                          <Width>0.35</Width>
                          <Length>0.35</Length>
                        </PassengerSpot>
                        <PassengerSpot id="33" version="1.0">
                          <Label>33</Label>
                          <Orientation>forwards</Orientation>
                          <actualVehicleEquipments />
                          <SpotColumnRef ref="SpotColumn/id/A" version="1.0" />
                          <SpotRowRef ref="SpotRow/id/9" version="1.0" />
                          <IsByWindow>true</IsByWindow>
                          <Centroid>
                            <Location>
                              <pos>6.328846153846153 0.251923</pos>
                            </Location>
                          </Centroid>
                          <Width>0.35</Width>
                          <Length>0.35</Length>
                        </PassengerSpot>
                        <PassengerSpot id="34" version="1.0">
                          <Label>34</Label>
                          <Orientation>forwards</Orientation>
                          <actualVehicleEquipments />
                          <SpotColumnRef ref="SpotColumn/id/B" version="1.0" />
                          <SpotRowRef ref="SpotRow/id/9" version="1.0" />
                          <Centroid>
                            <Location>
                              <pos>6.328846153846153 0.621154</pos>
                            </Location>
                          </Centroid>
                          <Width>0.35</Width>
                          <Length>0.35</Length>
                        </PassengerSpot>
                        <PassengerSpot id="38" version="1.0">
                          <Label>38</Label>
                          <Orientation>forwards</Orientation>
                          <actualVehicleEquipments />
                          <SpotColumnRef ref="SpotColumn/id/D" version="1.0" />
                          <SpotRowRef ref="SpotRow/id/9" version="1.0" />
                          <Centroid>
                            <Location>
                              <pos>6.328846153846153 1.388462</pos>
                            </Location>
                          </Centroid>
                          <Width>0.35</Width>
                          <Length>0.35</Length>
                        </PassengerSpot>
                        <PassengerSpot id="37" version="1.0">
                          <Label>37</Label>
                          <Orientation>forwards</Orientation>
                          <actualVehicleEquipments />
                          <SpotColumnRef ref="spot_column_1778936952743" version="1.0" />
                          <SpotRowRef ref="SpotRow/id/9" version="1.0" />
                          <IsByWindow>true</IsByWindow>
                          <Centroid>
                            <Location>
                              <pos>6.328846153846153 1.757692</pos>
                            </Location>
                          </Centroid>
                          <Width>0.35</Width>
                          <Length>0.35</Length>
                        </PassengerSpot>
                        <PassengerSpot id="41" version="1.0">
                          <Label>41</Label>
                          <Orientation>forwards</Orientation>
                          <actualVehicleEquipments />
                          <SpotColumnRef ref="SpotColumn/id/A" version="1.0" />
                          <SpotRowRef ref="SpotRow/id/11" version="1.0" />
                          <IsByWindow>true</IsByWindow>
                          <Centroid>
                            <Location>
                              <pos>7.544230769230768 0.251923</pos>
                            </Location>
                          </Centroid>
                          <Width>0.35</Width>
                          <Length>0.35</Length>
                        </PassengerSpot>
                        <PassengerSpot id="42" version="1.0">
                          <Label>42</Label>
                          <Orientation>forwards</Orientation>
                          <actualVehicleEquipments />
                          <SpotColumnRef ref="SpotColumn/id/B" version="1.0" />
                          <SpotRowRef ref="SpotRow/id/11" version="1.0" />
                          <Centroid>
                            <Location>
                              <pos>7.544230769230768 0.621154</pos>
                            </Location>
                          </Centroid>
                          <Width>0.35</Width>
                          <Length>0.35</Length>
                        </PassengerSpot>
                        <PassengerSpot id="49" version="1.0">
                          <Label>49</Label>
                          <Orientation>forwards</Orientation>
                          <actualVehicleEquipments />
                          <SpotColumnRef ref="SpotColumn/id/A" version="1.0" />
                          <SpotRowRef ref="spot_row_1778936986382" version="1.0" />
                          <IsByWindow>true</IsByWindow>
                          <Centroid>
                            <Location>
                              <pos>8.682692307692315 0.251923</pos>
                            </Location>
                          </Centroid>
                          <Width>0.35</Width>
                          <Length>0.35</Length>
                        </PassengerSpot>
                        <PassengerSpot id="50" version="1.0">
                          <Label>50</Label>
                          <Orientation>forwards</Orientation>
                          <actualVehicleEquipments />
                          <SpotColumnRef ref="SpotColumn/id/B" version="1.0" />
                          <SpotRowRef ref="spot_row_1778936986382" version="1.0" />
                          <Centroid>
                            <Location>
                              <pos>8.682692307692312 0.621154</pos>
                            </Location>
                          </Centroid>
                          <Width>0.35</Width>
                          <Length>0.35</Length>
                        </PassengerSpot>
                        <PassengerSpot id="57" version="1.0">
                          <Label>57</Label>
                          <Orientation>forwards</Orientation>
                          <actualVehicleEquipments />
                          <SpotColumnRef ref="SpotColumn/id/A" version="1.0" />
                          <SpotRowRef ref="spot_row_1778936987173" version="1.0" />
                          <Centroid>
                            <Location>
                              <pos>9.821153846153848 0.251923</pos>
                            </Location>
                          </Centroid>
                          <Width>0.35</Width>
                          <Length>0.35</Length>
                        </PassengerSpot>
                        <PassengerSpot id="58" version="1.0">
                          <Label>58</Label>
                          <Orientation>forwards</Orientation>
                          <actualVehicleEquipments />
                          <SpotColumnRef ref="SpotColumn/id/B" version="1.0" />
                          <SpotRowRef ref="spot_row_1778936987173" version="1.0" />
                          <Centroid>
                            <Location>
                              <pos>9.821153846153848 0.621154</pos>
                            </Location>
                          </Centroid>
                          <Width>0.35</Width>
                          <Length>0.35</Length>
                        </PassengerSpot>
                        <PassengerSpot id="65" version="1.0">
                          <Label>65</Label>
                          <Orientation>forwards</Orientation>
                          <actualVehicleEquipments />
                          <SpotColumnRef ref="SpotColumn/id/A" version="1.0" />
                          <SpotRowRef ref="spot_row_1778936988038" version="1.0" />
                          <IsByWindow>true</IsByWindow>
                          <Centroid>
                            <Location>
                              <pos>10.913461538461545 0.251923</pos>
                            </Location>
                          </Centroid>
                          <Width>0.35</Width>
                          <Length>0.35</Length>
                        </PassengerSpot>
                        <PassengerSpot id="66" version="1.0">
                          <Label>66</Label>
                          <Orientation>forwards</Orientation>
                          <actualVehicleEquipments />
                          <SpotColumnRef ref="SpotColumn/id/B" version="1.0" />
                          <SpotRowRef ref="spot_row_1778936988038" version="1.0" />
                          <Centroid>
                            <Location>
                              <pos>10.913461538461545 0.621154</pos>
                            </Location>
                          </Centroid>
                          <Width>0.35</Width>
                          <Length>0.35</Length>
                        </PassengerSpot>
                        <PassengerSpot id="70" version="1.0">
                          <Label>70</Label>
                          <Orientation>forwards</Orientation>
                          <actualVehicleEquipments />
                          <SpotColumnRef ref="SpotColumn/id/D" version="1.0" />
                          <SpotRowRef ref="spot_row_1778936988038" version="1.0" />
                          <Centroid>
                            <Location>
                              <pos>10.913461538461545 1.388462</pos>
                            </Location>
                          </Centroid>
                          <Width>0.35</Width>
                          <Length>0.35</Length>
                        </PassengerSpot>
                        <PassengerSpot id="69" version="1.0">
                          <Label>69</Label>
                          <Orientation>forwards</Orientation>
                          <actualVehicleEquipments />
                          <SpotColumnRef ref="spot_column_1778936952743" version="1.0" />
                          <SpotRowRef ref="spot_row_1778936988038" version="1.0" />
                          <IsByWindow>true</IsByWindow>
                          <Centroid>
                            <Location>
                              <pos>10.913461538461544 1.757692</pos>
                            </Location>
                          </Centroid>
                          <Width>0.35</Width>
                          <Length>0.35</Length>
                        </PassengerSpot>
                        <PassengerSpot id="62" version="1.0">
                          <Label>62</Label>
                          <Orientation>forwards</Orientation>
                          <actualVehicleEquipments />
                          <SpotColumnRef ref="SpotColumn/id/D" version="1.0" />
                          <SpotRowRef ref="spot_row_1778936987173" version="1.0" />
                          <IsByWindow>true</IsByWindow>
                          <Centroid>
                            <Location>
                              <pos>9.821153846153848 1.757692</pos>
                            </Location>
                          </Centroid>
                          <Width>0.35</Width>
                          <Length>0.35</Length>
                        </PassengerSpot>
                        <PassengerSpot id="61" version="1.0">
                          <Label>61</Label>
                          <Orientation>forwards</Orientation>
                          <actualVehicleEquipments />
                          <SpotColumnRef ref="spot_column_1778936952743" version="1.0" />
                          <SpotRowRef ref="spot_row_1778936987173" version="1.0" />
                          <Centroid>
                            <Location>
                              <pos>9.821153846153848 1.388462</pos>
                            </Location>
                          </Centroid>
                          <Width>0.35</Width>
                          <Length>0.35</Length>
                        </PassengerSpot>
                        <PassengerSpot id="54" version="1.0">
                          <Label>54</Label>
                          <Orientation>forwards</Orientation>
                          <actualVehicleEquipments />
                          <SpotColumnRef ref="SpotColumn/id/D" version="1.0" />
                          <SpotRowRef ref="spot_row_1778936986382" version="1.0" />
                          <IsByWindow>true</IsByWindow>
                          <Centroid>
                            <Location>
                              <pos>8.682692307692312 1.757692</pos>
                            </Location>
                          </Centroid>
                          <Width>0.35</Width>
                          <Length>0.35</Length>
                        </PassengerSpot>
                        <PassengerSpot id="53" version="1.0">
                          <Label>53</Label>
                          <Orientation>forwards</Orientation>
                          <actualVehicleEquipments />
                          <SpotColumnRef ref="spot_column_1778936952743" version="1.0" />
                          <SpotRowRef ref="spot_row_1778936986382" version="1.0" />
                          <Centroid>
                            <Location>
                              <pos>8.682692307692314 1.388462</pos>
                            </Location>
                          </Centroid>
                          <Width>0.35</Width>
                          <Length>0.35</Length>
                        </PassengerSpot>
                        <PassengerSpot id="46" version="1.0">
                          <Label>46</Label>
                          <Orientation>forwards</Orientation>
                          <actualVehicleEquipments />
                          <SpotColumnRef ref="SpotColumn/id/D" version="1.0" />
                          <SpotRowRef ref="SpotRow/id/11" version="1.0" />
                          <IsByWindow>true</IsByWindow>
                          <Centroid>
                            <Location>
                              <pos>7.544230769230768 1.757692</pos>
                            </Location>
                          </Centroid>
                          <Width>0.35</Width>
                          <Length>0.35</Length>
                        </PassengerSpot>
                        <PassengerSpot id="45" version="1.0">
                          <Label>45</Label>
                          <Orientation>forwards</Orientation>
                          <actualVehicleEquipments />
                          <SpotColumnRef ref="spot_column_1778936952743" version="1.0" />
                          <SpotRowRef ref="SpotRow/id/11" version="1.0" />
                          <Centroid>
                            <Location>
                              <pos>7.544230769230768 1.388462</pos>
                            </Location>
                          </Centroid>
                          <Width>0.35</Width>
                          <Length>0.35</Length>
                        </PassengerSpot>
                        <PassengerSpot id="3" version="1.0">
                          <Label>3</Label>
                          <Orientation>backwards</Orientation>
                          <actualVehicleEquipments />
                          <SpotColumnRef ref="SpotColumn/id/A" version="1.0" />
                          <SpotRowRef ref="SpotRow/id/2" version="1.0" />
                          <IsByWindow>true</IsByWindow>
                          <Centroid>
                            <Location>
                              <pos>2.3442307692307667 0.251923</pos>
                            </Location>
                          </Centroid>
                          <Width>0.35</Width>
                          <Length>0.35</Length>
                        </PassengerSpot>
                        <PassengerSpot id="4" version="1.0">
                          <Label>4</Label>
                          <Orientation>backwards</Orientation>
                          <actualVehicleEquipments />
                          <SpotColumnRef ref="SpotColumn/id/B" version="1.0" />
                          <SpotRowRef ref="SpotRow/id/2" version="1.0" />
                          <Centroid>
                            <Location>
                              <pos>2.3442307692307676 0.621154</pos>
                            </Location>
                          </Centroid>
                          <Width>0.35</Width>
                          <Length>0.35</Length>
                        </PassengerSpot>
                        <PassengerSpot id="8" version="1.0">
                          <Label>8</Label>
                          <Orientation>backwards</Orientation>
                          <actualVehicleEquipments />
                          <SpotColumnRef ref="SpotColumn/id/D" version="1.0" />
                          <SpotRowRef ref="SpotRow/id/2" version="1.0" />
                          <Centroid>
                            <Location>
                              <pos>2.3442307692307676 1.388462</pos>
                            </Location>
                          </Centroid>
                          <Width>0.35</Width>
                          <Length>0.35</Length>
                        </PassengerSpot>
                        <PassengerSpot id="7" version="1.0">
                          <Label>7</Label>
                          <Orientation>backwards</Orientation>
                          <actualVehicleEquipments />
                          <SpotColumnRef ref="spot_column_1778936952743" version="1.0" />
                          <SpotRowRef ref="SpotRow/id/2" version="1.0" />
                          <IsByWindow>true</IsByWindow>
                          <Centroid>
                            <Location>
                              <pos>2.344230769230767 1.757692</pos>
                            </Location>
                          </Centroid>
                          <Width>0.35</Width>
                          <Length>0.35</Length>
                        </PassengerSpot>
                        <PassengerSpot id="11" version="1.0">
                          <Label>11</Label>
                          <Orientation>backwards</Orientation>
                          <actualVehicleEquipments />
                          <SpotColumnRef ref="SpotColumn/id/A" version="1.0" />
                          <SpotRowRef ref="SpotRow/id/4" version="1.0" />
                          <IsByWindow>true</IsByWindow>
                          <Centroid>
                            <Location>
                              <pos>3.5749999999999997 0.251923</pos>
                            </Location>
                          </Centroid>
                          <Width>0.35</Width>
                          <Length>0.35</Length>
                        </PassengerSpot>
                        <PassengerSpot id="12" version="1.0">
                          <Label>12</Label>
                          <Orientation>backwards</Orientation>
                          <actualVehicleEquipments />
                          <SpotColumnRef ref="SpotColumn/id/B" version="1.0" />
                          <SpotRowRef ref="SpotRow/id/4" version="1.0" />
                          <Centroid>
                            <Location>
                              <pos>3.5749999999999997 0.621154</pos>
                            </Location>
                          </Centroid>
                          <Width>0.35</Width>
                          <Length>0.35</Length>
                        </PassengerSpot>
                        <PassengerSpot id="19" version="1.0">
                          <Label>19</Label>
                          <Orientation>backwards</Orientation>
                          <actualVehicleEquipments />
                          <SpotColumnRef ref="SpotColumn/id/A" version="1.0" />
                          <SpotRowRef ref="SpotRow/id/6" version="1.0" />
                          <Centroid>
                            <Location>
                              <pos>3.5749999999999997 1.388462</pos>
                            </Location>
                          </Centroid>
                          <Width>0.35</Width>
                          <Length>0.35</Length>
                        </PassengerSpot>
                        <PassengerSpot id="20" version="1.0">
                          <Label>20</Label>
                          <Orientation>backwards</Orientation>
                          <actualVehicleEquipments />
                          <SpotColumnRef ref="SpotColumn/id/B" version="1.0" />
                          <SpotRowRef ref="SpotRow/id/6" version="1.0" />
                          <IsByWindow>true</IsByWindow>
                          <Centroid>
                            <Location>
                              <pos>3.5749999999999997 1.757692</pos>
                            </Location>
                          </Centroid>
                          <Width>0.35</Width>
                          <Length>0.35</Length>
                        </PassengerSpot>
                        <PassengerSpot id="16" version="1.0">
                          <Label>16</Label>
                          <Orientation>backwards</Orientation>
                          <actualVehicleEquipments />
                          <SpotColumnRef ref="SpotColumn/id/D" version="1.0" />
                          <SpotRowRef ref="SpotRow/id/4" version="1.0" />
                          <Centroid>
                            <Location>
                              <pos>4.759615384615384 0.621154</pos>
                            </Location>
                          </Centroid>
                          <Width>0.35</Width>
                          <Length>0.35</Length>
                        </PassengerSpot>
                        <PassengerSpot id="15" version="1.0">
                          <Label>15</Label>
                          <Orientation>backwards</Orientation>
                          <actualVehicleEquipments />
                          <SpotColumnRef ref="spot_column_1778936952743" version="1.0" />
                          <SpotRowRef ref="SpotRow/id/4" version="1.0" />
                          <IsByWindow>true</IsByWindow>
                          <Centroid>
                            <Location>
                              <pos>4.759615384615384 0.251923</pos>
                            </Location>
                          </Centroid>
                          <Width>0.35</Width>
                          <Length>0.35</Length>
                        </PassengerSpot>
                        <PassengerSpot id="24" version="1.0">
                          <Label>24</Label>
                          <Orientation>backwards</Orientation>
                          <actualVehicleEquipments />
                          <SpotColumnRef ref="SpotColumn/id/D" version="1.0" />
                          <SpotRowRef ref="SpotRow/id/6" version="1.0" />
                          <Centroid>
                            <Location>
                              <pos>4.759615384615384 1.388462</pos>
                            </Location>
                          </Centroid>
                          <Width>0.35</Width>
                          <Length>0.35</Length>
                        </PassengerSpot>
                        <PassengerSpot id="23" version="1.0">
                          <Label>23</Label>
                          <Orientation>backwards</Orientation>
                          <actualVehicleEquipments />
                          <SpotColumnRef ref="spot_column_1778936952743" version="1.0" />
                          <SpotRowRef ref="SpotRow/id/6" version="1.0" />
                          <IsByWindow>true</IsByWindow>
                          <Centroid>
                            <Location>
                              <pos>4.759615384615384 1.757692</pos>
                            </Location>
                          </Centroid>
                          <Width>0.35</Width>
                          <Length>0.35</Length>
                        </PassengerSpot>
                        <PassengerSpot id="27" version="1.0">
                          <Label>27</Label>
                          <Orientation>backwards</Orientation>
                          <actualVehicleEquipments />
                          <SpotColumnRef ref="SpotColumn/id/A" version="1.0" />
                          <SpotRowRef ref="SpotRow/id/8" version="1.0" />
                          <IsByWindow>true</IsByWindow>
                          <Centroid>
                            <Location>
                              <pos>5.944230769230765 0.251923</pos>
                            </Location>
                          </Centroid>
                          <Width>0.35</Width>
                          <Length>0.35</Length>
                        </PassengerSpot>
                        <PassengerSpot id="28" version="1.0">
                          <Label>28</Label>
                          <Orientation>backwards</Orientation>
                          <actualVehicleEquipments />
                          <SpotColumnRef ref="SpotColumn/id/B" version="1.0" />
                          <SpotRowRef ref="SpotRow/id/8" version="1.0" />
                          <Centroid>
                            <Location>
                              <pos>5.944230769230766 0.621154</pos>
                            </Location>
                          </Centroid>
                          <Width>0.35</Width>
                          <Length>0.35</Length>
                        </PassengerSpot>
                        <PassengerSpot id="32" version="1.0">
                          <Label>32</Label>
                          <Orientation>backwards</Orientation>
                          <actualVehicleEquipments />
                          <SpotColumnRef ref="SpotColumn/id/D" version="1.0" />
                          <SpotRowRef ref="SpotRow/id/8" version="1.0" />
                          <Centroid>
                            <Location>
                              <pos>5.944230769230766 1.388462</pos>
                            </Location>
                          </Centroid>
                          <Width>0.35</Width>
                          <Length>0.35</Length>
                        </PassengerSpot>
                        <PassengerSpot id="31" version="1.0">
                          <Label>31</Label>
                          <Orientation>backwards</Orientation>
                          <actualVehicleEquipments />
                          <SpotColumnRef ref="spot_column_1778936952743" version="1.0" />
                          <SpotRowRef ref="SpotRow/id/8" version="1.0" />
                          <IsByWindow>true</IsByWindow>
                          <Centroid>
                            <Location>
                              <pos>5.944230769230765 1.757692</pos>
                            </Location>
                          </Centroid>
                          <Width>0.35</Width>
                          <Length>0.35</Length>
                        </PassengerSpot>
                        <PassengerSpot id="35" version="1.0">
                          <Label>35</Label>
                          <Orientation>backwards</Orientation>
                          <actualVehicleEquipments />
                          <SpotColumnRef ref="SpotColumn/id/A" version="1.0" />
                          <SpotRowRef ref="SpotRow/id/10" version="1.0" />
                          <IsByWindow>true</IsByWindow>
                          <Centroid>
                            <Location>
                              <pos>7.174999999999999 0.251923</pos>
                            </Location>
                          </Centroid>
                          <Width>0.35</Width>
                          <Length>0.35</Length>
                        </PassengerSpot>
                        <PassengerSpot id="43" version="1.0">
                          <Label>43</Label>
                          <Orientation>backwards</Orientation>
                          <actualVehicleEquipments />
                          <SpotColumnRef ref="SpotColumn/id/A" version="1.0" />
                          <SpotRowRef ref="spot_row_1778936985294" version="1.0" />
                          <Centroid>
                            <Location>
                              <pos>8.313461538461542 0.621154</pos>
                            </Location>
                          </Centroid>
                          <Width>0.35</Width>
                          <Length>0.35</Length>
                        </PassengerSpot>
                        <PassengerSpot id="36" version="1.0">
                          <Label>36</Label>
                          <Orientation>backwards</Orientation>
                          <actualVehicleEquipments />
                          <SpotColumnRef ref="SpotColumn/id/B" version="1.0" />
                          <SpotRowRef ref="SpotRow/id/10" version="1.0" />
                          <Centroid>
                            <Location>
                              <pos>7.174999999999999 0.621154</pos>
                            </Location>
                          </Centroid>
                          <Width>0.35</Width>
                          <Length>0.35</Length>
                        </PassengerSpot>
                        <PassengerSpot id="40" version="1.0">
                          <Label>40</Label>
                          <Orientation>backwards</Orientation>
                          <actualVehicleEquipments />
                          <SpotColumnRef ref="SpotColumn/id/D" version="1.0" />
                          <SpotRowRef ref="SpotRow/id/10" version="1.0" />
                          <IsByWindow>true</IsByWindow>
                          <Centroid>
                            <Location>
                              <pos>7.174999999999999 1.757692</pos>
                            </Location>
                          </Centroid>
                          <Width>0.35</Width>
                          <Length>0.35</Length>
                        </PassengerSpot>
                        <PassengerSpot id="39" version="1.0">
                          <Label>39</Label>
                          <Orientation>backwards</Orientation>
                          <actualVehicleEquipments />
                          <SpotColumnRef ref="spot_column_1778936952743" version="1.0" />
                          <SpotRowRef ref="SpotRow/id/10" version="1.0" />
                          <Centroid>
                            <Location>
                              <pos>7.174999999999999 1.388462</pos>
                            </Location>
                          </Centroid>
                          <Width>0.35</Width>
                          <Length>0.35</Length>
                        </PassengerSpot>
                        <PassengerSpot id="44" version="1.0">
                          <Label>44</Label>
                          <Orientation>backwards</Orientation>
                          <actualVehicleEquipments />
                          <SpotColumnRef ref="SpotColumn/id/B" version="1.0" />
                          <SpotRowRef ref="spot_row_1778936985294" version="1.0" />
                          <IsByWindow>true</IsByWindow>
                          <Centroid>
                            <Location>
                              <pos>8.313461538461542 0.251923</pos>
                            </Location>
                          </Centroid>
                          <Width>0.35</Width>
                          <Length>0.35</Length>
                        </PassengerSpot>
                        <PassengerSpot id="48" version="1.0">
                          <Label>48</Label>
                          <Orientation>backwards</Orientation>
                          <actualVehicleEquipments />
                          <SpotColumnRef ref="SpotColumn/id/D" version="1.0" />
                          <SpotRowRef ref="spot_row_1778936985294" version="1.0" />
                          <Centroid>
                            <Location>
                              <pos>8.313461538461542 1.388462</pos>
                            </Location>
                          </Centroid>
                          <Width>0.35</Width>
                          <Length>0.35</Length>
                        </PassengerSpot>
                        <PassengerSpot id="47" version="1.0">
                          <Label>47</Label>
                          <Orientation>backwards</Orientation>
                          <actualVehicleEquipments />
                          <SpotColumnRef ref="spot_column_1778936952743" version="1.0" />
                          <SpotRowRef ref="spot_row_1778936985294" version="1.0" />
                          <IsByWindow>true</IsByWindow>
                          <Centroid>
                            <Location>
                              <pos>8.313461538461542 1.757692</pos>
                            </Location>
                          </Centroid>
                          <Width>0.35</Width>
                          <Length>0.35</Length>
                        </PassengerSpot>
                        <PassengerSpot id="51" version="1.0">
                          <Label>51</Label>
                          <Orientation>backwards</Orientation>
                          <actualVehicleEquipments />
                          <SpotColumnRef ref="SpotColumn/id/A" version="1.0" />
                          <SpotRowRef ref="spot_row_1778936986822" version="1.0" />
                          <IsByWindow>true</IsByWindow>
                          <Centroid>
                            <Location>
                              <pos>9.45192307692308 0.251923</pos>
                            </Location>
                          </Centroid>
                          <Width>0.35</Width>
                          <Length>0.35</Length>
                        </PassengerSpot>
                        <PassengerSpot id="52" version="1.0">
                          <Label>52</Label>
                          <Orientation>backwards</Orientation>
                          <actualVehicleEquipments />
                          <SpotColumnRef ref="SpotColumn/id/B" version="1.0" />
                          <SpotRowRef ref="spot_row_1778936986822" version="1.0" />
                          <Centroid>
                            <Location>
                              <pos>9.45192307692308 0.621154</pos>
                            </Location>
                          </Centroid>
                          <Width>0.35</Width>
                          <Length>0.35</Length>
                        </PassengerSpot>
                        <PassengerSpot id="56" version="1.0">
                          <Label>56</Label>
                          <Orientation>backwards</Orientation>
                          <actualVehicleEquipments />
                          <SpotColumnRef ref="SpotColumn/id/D" version="1.0" />
                          <SpotRowRef ref="spot_row_1778936986822" version="1.0" />
                          <Centroid>
                            <Location>
                              <pos>9.45192307692308 1.388462</pos>
                            </Location>
                          </Centroid>
                          <Width>0.35</Width>
                          <Length>0.35</Length>
                        </PassengerSpot>
                        <PassengerSpot id="55" version="1.0">
                          <Label>55</Label>
                          <Orientation>backwards</Orientation>
                          <actualVehicleEquipments />
                          <SpotColumnRef ref="spot_column_1778936952743" version="1.0" />
                          <SpotRowRef ref="spot_row_1778936986822" version="1.0" />
                          <IsByWindow>true</IsByWindow>
                          <Centroid>
                            <Location>
                              <pos>9.45192307692308 1.757692</pos>
                            </Location>
                          </Centroid>
                          <Width>0.35</Width>
                          <Length>0.35</Length>
                        </PassengerSpot>
                        <PassengerSpot id="59" version="1.0">
                          <Label>59</Label>
                          <Orientation>backwards</Orientation>
                          <actualVehicleEquipments />
                          <SpotColumnRef ref="SpotColumn/id/A" version="1.0" />
                          <SpotRowRef ref="spot_row_1778936987614" version="1.0" />
                          <IsByWindow>true</IsByWindow>
                          <Centroid>
                            <Location>
                              <pos>10.544230769230772 1.757692</pos>
                            </Location>
                          </Centroid>
                          <Width>0.35</Width>
                          <Length>0.35</Length>
                        </PassengerSpot>
                        <PassengerSpot id="60" version="1.0">
                          <Label>60</Label>
                          <Orientation>backwards</Orientation>
                          <actualVehicleEquipments />
                          <SpotColumnRef ref="SpotColumn/id/B" version="1.0" />
                          <SpotRowRef ref="spot_row_1778936987614" version="1.0" />
                          <Centroid>
                            <Location>
                              <pos>10.544230769230772 0.621154</pos>
                            </Location>
                          </Centroid>
                          <Width>0.35</Width>
                          <Length>0.35</Length>
                        </PassengerSpot>
                        <PassengerSpot id="64" version="1.0">
                          <Label>64</Label>
                          <Orientation>backwards</Orientation>
                          <actualVehicleEquipments />
                          <SpotColumnRef ref="SpotColumn/id/D" version="1.0" />
                          <SpotRowRef ref="spot_row_1778936987614" version="1.0" />
                          <Centroid>
                            <Location>
                              <pos>10.544230769230772 1.388462</pos>
                            </Location>
                          </Centroid>
                          <Width>0.35</Width>
                          <Length>0.35</Length>
                        </PassengerSpot>
                        <PassengerSpot id="63" version="1.0">
                          <Label>63</Label>
                          <Orientation>backwards</Orientation>
                          <actualVehicleEquipments />
                          <SpotColumnRef ref="spot_column_1778936952743" version="1.0" />
                          <SpotRowRef ref="spot_row_1778936987614" version="1.0" />
                          <IsByWindow>true</IsByWindow>
                          <Centroid>
                            <Location>
                              <pos>10.544230769230772 0.251923</pos>
                            </Location>
                          </Centroid>
                          <Width>0.35</Width>
                          <Length>0.35</Length>
                        </PassengerSpot>
                        <PassengerSpot id="67" version="1.0">
                          <Label>67</Label>
                          <Orientation>backwards</Orientation>
                          <actualVehicleEquipments />
                          <SpotColumnRef ref="SpotColumn/id/A" version="1.0" />
                          <SpotRowRef ref="spot_row_1778936988454" version="1.0" />
                          <IsByWindow>true</IsByWindow>
                          <Centroid>
                            <Location>
                              <pos>11.665384615384616 0.251923</pos>
                            </Location>
                          </Centroid>
                          <Width>0.35</Width>
                          <Length>0.35</Length>
                        </PassengerSpot>
                        <PassengerSpot id="68" version="1.0">
                          <Label>68</Label>
                          <Orientation>backwards</Orientation>
                          <actualVehicleEquipments />
                          <SpotColumnRef ref="SpotColumn/id/B" version="1.0" />
                          <SpotRowRef ref="spot_row_1778936988454" version="1.0" />
                          <Centroid>
                            <Location>
                              <pos>11.665384615384616 0.621154</pos>
                            </Location>
                          </Centroid>
                          <Width>0.35</Width>
                          <Length>0.35</Length>
                        </PassengerSpot>
                        <PassengerSpot id="72" version="1.0">
                          <Label>72</Label>
                          <Orientation>backwards</Orientation>
                          <actualVehicleEquipments />
                          <SpotColumnRef ref="SpotColumn/id/D" version="1.0" />
                          <SpotRowRef ref="spot_row_1778936988454" version="1.0" />
                          <Centroid>
                            <Location>
                              <pos>11.665384615384616 1.388462</pos>
                            </Location>
                          </Centroid>
                          <Width>0.35</Width>
                          <Length>0.35</Length>
                        </PassengerSpot>
                        <PassengerSpot id="71" version="1.0">
                          <Label>71</Label>
                          <Orientation>backwards</Orientation>
                          <actualVehicleEquipments />
                          <SpotColumnRef ref="spot_column_1778936952743" version="1.0" />
                          <SpotRowRef ref="spot_row_1778936988454" version="1.0" />
                          <IsByWindow>true</IsByWindow>
                          <Centroid>
                            <Location>
                              <pos>11.665384615384616 1.757692</pos>
                            </Location>
                          </Centroid>
                          <Width>0.35</Width>
                          <Length>0.35</Length>
                        </PassengerSpot>
                      </passengerSpots>
                      <luggageSpots />
                      <deckEntrances>
                        <PassengerEntrance id="entrance_1778950926855" version="1.0">
                          <actualVehicleEquipments />
                          <Centroid>
                            <Location>
                              <pos>0.3111111111111111 0.05641</pos>
                            </Location>
                          </Centroid>
                        </PassengerEntrance>
                        <PassengerEntrance id="entrance_1778950928595" version="1.0">
                          <actualVehicleEquipments />
                          <Centroid>
                            <Location>
                              <pos>12.2 0.022222</pos>
                            </Location>
                          </Centroid>
                        </PassengerEntrance>
                        <PassengerEntrance id="entrance_1778950938091" version="1.0">
                          <actualVehicleEquipments />
                          <Centroid>
                            <Location>
                              <pos>0.3111111111111111 1.929915</pos>
                            </Location>
                          </Centroid>
                        </PassengerEntrance>
                        <PassengerEntrance id="entrance_1778950940714" version="1.0">
                          <actualVehicleEquipments />
                          <Centroid>
                            <Location>
                              <pos>12.184615384615384 1.947009</pos>
                            </Location>
                          </Centroid>
                        </PassengerEntrance>
                      </deckEntrances>
                      <deckEntranceUsage />
                      <deckEntranceCouples />
                      <deckSpaceCapacities />
                      <actualVehicleEquipments />
                      <FareClass>Standard</FareClass>
                    </PassengerSpace>
                  </deckSpaces>
                  <DeckLevelRef ref="deck_level_0" version="1.0" />
                  <Name />
                  <Width>2</Width>
                  <Length>13</Length>
                </Deck>
              </decks>
              <deckLevels>
                <DeckLevel id="deck_level_0" version="1.0">
                  <Label>Level 0</Label>
                </DeckLevel>
              </deckLevels>
            </DeckPlan>
          </deckPlans>
          <schematicMaps>
            <SchematicMap>
              <Name>Talent 3 seat map</Name>
              <ImageUri>https://www.example.com</ImageUri>
              <DepictedObjectRef ref="Train/id/1" />
            </SchematicMap>
          </schematicMaps>
        </ResourceFrame>
      </frames>
    </CompositeFrame>
  </dataObjects>
</PublicationDelivery>`}));function H({railWidth:e=ir,...t}){let[n,r]=(0,nr.useState)(fr);return(0,U.jsx)(i,{sx:{width:e,maxWidth:`100%`,border:1,borderColor:`divider`,borderRadius:1,p:2},children:(0,U.jsx)(Mn,{...t,value:n,onChange:r})})}function tr(e,t){let n=e.flatMap((e,t)=>Bn(zn(Vn.parse(e))?.deckPlans?.DeckPlan).flatMap(e=>Bn(e?.decks?.Deck).map(e=>({...e,"@_id":`SAMPLE:Deck:${t+1}`}))));return new Cn({ignoreAttributes:!1,suppressEmptyNode:!0}).build({PublicationDelivery:{"@_xmlns":`http://www.netex.org.uk/netex`,dataObjects:{CompositeFrame:{"@_version":`1`,"@_id":`SAMPLE:CompositeFrame:1`,frames:{ResourceFrame:{"@_version":`1`,"@_id":`SAMPLE:ResourceFrame:1`,deckPlans:{DeckPlan:{"@_version":`1`,"@_id":t,decks:{Deck:n}}}}}}}}})}var nr,U,W,rr,ir,ar,or,sr,cr,lr,G,K,ur,dr,fr,pr,q,J,Y,X,Z,Q,$,mr;e((()=>{nr=t(s(),1),Tn(),f(),Rn(),ce(),Hn(),Wn(),Kn(),Jn(),Xn(),Qn(),er(),U=u(),{expect:W,waitFor:rr}=__STORYBOOK_MODULE_TEST__,ir=460,ar=280,or=1200,sr=20,cr=[Un,Gn,qn,Yn,Zn,$n],lr=[80,46,72,80,46,72],G=`NMR:DeckPlan:5`,K=tr(cr,G),ur=46,dr=ie([],G),fr={id:G,version:2,name:{value:`Plan Alpha`},description:{value:`Alpha lower-deck variant`}},pr={title:`data/deck-plans/DeckPlanForm`,component:Mn,parameters:{layout:`padded`,docs:{description:{component:"The deck-plan sidebar editor. Tabs stay `Edit | XML`; the per-deck renderings live *inside* the Edit tab, below Name/Description, as a horizontal strip. Decks draw `vertical` — at ~26.4m × 2.8m the native orientation overflows the sidebar for even one deck, where rotated columns sit side by side and read as a vehicle seen from above. Both tabs render from the same fetched body, so they share its loading and fetch-error states; that chrome wraps only the body panes, never the fields."}}},args:{railWidth:ir},argTypes:{railWidth:{name:`rail width (px)`,description:`Width of the wrapper standing in for the resizable sidebar.`,control:{type:`range`,min:ar,max:or,step:sr}}}},q={mode:`edit`,isCreate:!1,loading:!1,fetchError:null,onRetry:()=>{}},J={render:e=>(0,U.jsx)(H,{...q,railWidth:e.railWidth,xml:K}),play:async({canvasElement:e})=>{await rr(()=>{let t=e.querySelectorAll(`deck-rendering`);W(t).toHaveLength(cr.length),W([...t].map(e=>e.shadowRoot.querySelectorAll(`g.seat`).length)).toEqual(lr)});let t=e.querySelector(`[data-testid="deck-plan-decks"]`);W(t.textContent).toContain(`Deck 1`),W(t.textContent).toContain(`Deck 6`),W(e.querySelector(`[data-testid="deck-plan-decks-sample"]`)).toBeNull()}},Y={render:e=>(0,U.jsx)(H,{...q,railWidth:e.railWidth,xml:dr}),play:async({canvasElement:e})=>{await rr(()=>W(e.querySelector(`[data-testid="deck-plan-decks-sample"]`)).not.toBeNull());let t=e.querySelectorAll(`deck-rendering`);W(t).toHaveLength(1),W(t[0].shadowRoot.querySelectorAll(`g.seat`)).toHaveLength(ur)}},X={render:e=>(0,U.jsx)(H,{...q,railWidth:e.railWidth,mode:`view`,xml:K})},Z={render:e=>(0,U.jsx)(H,{...q,railWidth:e.railWidth,loading:!0,xml:``}),play:async({canvasElement:e})=>{W(e.querySelector(`[data-testid="deck-plan-decks-loading"]`)).not.toBeNull(),W(e.querySelector(`#deckPlan-name`).disabled).toBe(!1)}},Q={render:e=>(0,U.jsx)(H,{...q,railWidth:e.railWidth,xml:``,fetchError:`503 Service Unavailable`})},$={render:e=>(0,U.jsx)(H,{...q,railWidth:e.railWidth,isCreate:!0,xml:``}),play:async({canvasElement:e})=>{W(e.querySelector(`[data-testid="deck-plan-tab-edit"]`)).not.toBeNull(),W(e.querySelector(`deck-rendering`)).toBeNull(),W(e.querySelectorAll(`[role="tab"]`)).toHaveLength(0)}},J.parameters={...J.parameters,docs:{...J.parameters?.docs,source:{originalSource:`{
  render: args => <Editor {...base} railWidth={args.railWidth} xml={SIX_DECKS} />,
  play: async ({
    canvasElement
  }) => {
    // The strip appears only once the bundle has loaded and the body parsed,
    // so every lookup has to happen inside the poll.
    await waitFor(() => {
      const els = canvasElement.querySelectorAll('deck-rendering');
      expect(els).toHaveLength(WAGONS.length);
      // One element per Deck, seats drawn inside each element's shadow root.
      const seats = [...els].map(el => el.shadowRoot!.querySelectorAll('g.seat').length);
      expect(seats).toEqual(WAGON_SEATS);
    });
    const strip = canvasElement.querySelector('[data-testid="deck-plan-decks"]')!;
    // The samples carry no <Deck><Name>, so captions use the ordinal fallback.
    expect(strip.textContent).toContain('Deck 1');
    expect(strip.textContent).toContain('Deck 6');
    // No SAMPLE chrome when the plan actually carries decks.
    expect(canvasElement.querySelector('[data-testid="deck-plan-decks-sample"]')).toBeNull();
  }
}`,...J.parameters?.docs?.source},description:{story:"The default: fields on top, one rendering per Deck below, captioned by name.\nThis is the story the `<deck-rendering>` wiring exists for.",...J.parameters?.docs?.description}}},Y.parameters={...Y.parameters,docs:{...Y.parameters?.docs,source:{originalSource:`{
  render: args => <Editor {...base} railWidth={args.railWidth} xml={NO_DECKS} />,
  play: async ({
    canvasElement
  }) => {
    await waitFor(() => expect(canvasElement.querySelector('[data-testid="deck-plan-decks-sample"]')).not.toBeNull());
    const els = canvasElement.querySelectorAll('deck-rendering');
    expect(els).toHaveLength(1);
    // The ghost is Wagon_2's deck, so it draws a populated layout rather than
    // an empty outline — the SAMPLE tab should look like a real deck plan.
    expect(els[0].shadowRoot!.querySelectorAll('g.seat')).toHaveLength(GHOST_SEATS);
  }
}`,...Y.parameters?.docs?.source},description:{story:"A plan with an empty `<decks/>` — the common case on real data. One ghost\ndeck is drawn under a SAMPLE heading so the tab is never blank.",...Y.parameters?.docs?.description}}},X.parameters={...X.parameters,docs:{...X.parameters?.docs,source:{originalSource:`{
  render: args => <Editor {...base} railWidth={args.railWidth} mode="view" xml={SIX_DECKS} />
}`,...X.parameters?.docs?.source},description:{story:`Read-only: inputs disabled, renderings unaffected.`,...X.parameters?.docs?.description}}},Z.parameters={...Z.parameters,docs:{...Z.parameters?.docs,source:{originalSource:`{
  render: args => <Editor {...base} railWidth={args.railWidth} loading xml="" />,
  play: async ({
    canvasElement
  }) => {
    expect(canvasElement.querySelector('[data-testid="deck-plan-decks-loading"]')).not.toBeNull();
    expect(canvasElement.querySelector<HTMLInputElement>('#deckPlan-name')!.disabled).toBe(false);
  }
}`,...Z.parameters?.docs?.source},description:{story:`Body fetch in flight. The spinner replaces the strip only — Name and
Description stay interactive, so a slow fetch never blocks typing.`,...Z.parameters?.docs?.description}}},Q.parameters={...Q.parameters,docs:{...Q.parameters?.docs,source:{originalSource:`{
  render: args => <Editor {...base} railWidth={args.railWidth} xml="" fetchError="503 Service Unavailable" />
}`,...Q.parameters?.docs?.source},description:{story:`Body fetch failed — alert plus retry, again scoped to the strip.`,...Q.parameters?.docs?.description}}},$.parameters={...$.parameters,docs:{...$.parameters?.docs,source:{originalSource:`{
  render: args => <Editor {...base} railWidth={args.railWidth} isCreate xml="" />,
  play: async ({
    canvasElement
  }) => {
    expect(canvasElement.querySelector('[data-testid="deck-plan-tab-edit"]')).not.toBeNull();
    expect(canvasElement.querySelector('deck-rendering')).toBeNull();
    expect(canvasElement.querySelectorAll('[role="tab"]')).toHaveLength(0);
  }
}`,...$.parameters?.docs?.source},description:{story:`Create flow — no persisted body yet, so no tab strip and no renderings.`,...$.parameters?.docs?.description}}},mr=[`EditTab`,`EditTabSample`,`ViewMode`,`BodyLoading`,`BodyFetchError`,`Create`]}))();export{Q as BodyFetchError,Z as BodyLoading,$ as Create,J as EditTab,Y as EditTabSample,X as ViewMode,mr as __namedExportsOrder,pr as default};