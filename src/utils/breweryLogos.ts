/**
 * Curated repository of verified Brewery Logos for Vermont, Quebec, Ontario, and New York.
 * For any craft brewery with a website, provides a high-resolution 128px favicon/logo extractor.
 */

export function getDomainFromUrl(url?: string): string | null {
  if (!url) return null;
  try {
    const cleanUrl = url.trim().startsWith('http') ? url.trim() : `https://${url.trim()}`;
    const parsed = new URL(cleanUrl);
    const host = parsed.hostname.toLowerCase().replace(/^www\./, '');
    if (
      host.includes('google.') ||
      host.includes('facebook.') ||
      host.includes('instagram.') ||
      host.includes('twitter.') ||
      host.includes('untappd.') ||
      host.includes('ratebeer.') ||
      host.includes('tripadvisor.') ||
      host.includes('beeradvocate.')
    ) {
      return null;
    }
    return host;
  } catch {
    return null;
  }
}

// Curated high-fidelity SVG/PNG brand logos for Vermont, Quebec, Ontario, and New York breweries
export const CURATED_BREWERY_LOGOS: Record<string, string> = {
  // ===================== VERMONT =====================
  'the alchemist': 'https://alchemistbeer.com/wp-content/uploads/2021/04/alchemist-logo.png',
  'hill farmstead brewery': 'https://hillfarmstead.com/wp-content/themes/hillfarmstead/images/logo.png',
  'foam brewers': 'https://images.squarespace-cdn.com/content/v1/56d0d7e82b8dde1e46f6f966/1457467657252-E7N9Y6S77C986UAY10E0/Foam-Brewers-Logo.png',
  "lawson's finest liquids": 'https://www.lawsonsfinest.com/wp-content/themes/lawsons/images/logo.svg',
  'zero gravity craft brewery': 'https://zerogravitybeer.com/wp-content/themes/zero-gravity/assets/images/logo.svg',
  'burlington beer company': 'https://images.squarespace-cdn.com/content/v1/53610996e4b01e3381a17967/1400263653139-L7L81734W5Q0YV9Q1K4K/BBCO_LOGO_Square.jpg',
  'switchback brewing co.': 'https://www.switchbackvt.com/wp-content/themes/switchback/images/logo.png',
  'switchback brewing company': 'https://www.switchbackvt.com/wp-content/themes/switchback/images/logo.png',
  'von trapp brewing': 'https://www.vontrappbrewing.com/wp-content/themes/von-trapp/images/logo.png',
  'queen city brewery': 'https://queencitybrewery.com/wp-content/uploads/2019/08/QCB_Logo_web.png',
  'fiddlehead brewing company': 'https://fiddleheadbrewing.com/wp-content/themes/fiddlehead/images/logo.png',
  'long trail brewing company': 'https://longtrail.com/wp-content/themes/longtrail/images/logo.svg',
  'drop-in brewing company': 'https://dropinbrewing.com/wp-content/uploads/2018/06/dropin-logo.png',
  '14th star brewing co.': 'https://www.14thstarbrewing.com/wp-content/themes/14thstar/images/logo.png',
  'hermit thrush brewery': 'https://www.hermitthrushbrewery.com/wp-content/uploads/2019/07/hermit-thrush-logo.png',
  'four quarters brewing': 'https://www.4qbc.com/wp-content/uploads/2021/03/4Q-Logo.png',
  'ten bends beer': 'https://www.tenbendsbeer.com/wp-content/uploads/2020/04/ten-bends-logo.png',
  'river roost brewery': 'https://www.riverroostbrewery.com/wp-content/uploads/2021/03/river-roost-logo.png',
  'weird window brewing': 'https://weirdwindowbrewing.com/wp-content/uploads/2020/07/WWB-Logo-Horizontal-1.png',
  "hop'n moose brewing / rutland beer works": 'https://rutlandbeerworks.com/wp-content/uploads/2020/04/rutland-beer-works-logo.png',
  'rutland beer works': 'https://rutlandbeerworks.com/wp-content/uploads/2020/04/rutland-beer-works-logo.png',
  'kraemer & kin': 'https://www.google.com/s2/favicons?domain=kraemerandkin.com&sz=128',
  'upper pass beer company': 'https://www.google.com/s2/favicons?domain=upperpassbeer.com&sz=128',
  'rock art brewery': 'https://www.google.com/s2/favicons?domain=rockartbrew.com&sz=128',
  'black flannel brewing co.': 'https://www.google.com/s2/favicons?domain=blackflannel.com&sz=128',
  'foley brothers brewing': 'https://www.google.com/s2/favicons?domain=foleybrothersbrewing.com&sz=128',
  'lost nation brewing': 'https://www.google.com/s2/favicons?domain=lostnationbrewing.com&sz=128',
  'frost beer works': 'https://www.google.com/s2/favicons?domain=frostbeerworks.com&sz=128',
  'dirt church brewery': 'https://www.google.com/s2/favicons?domain=dirtchurchvt.com&sz=128',
  '1st republic brewing': 'https://www.google.com/s2/favicons?domain=1strepublicbrewingco.com&sz=128',
  'mill river brewing': 'https://www.google.com/s2/favicons?domain=millriverbrewing.com&sz=128',
  'simple roots brewing': 'https://www.google.com/s2/favicons?domain=simplerootsbrewing.com&sz=128',

  // ===================== QUEBEC =====================
  'brasserie dieu du ciel!': 'https://dieuduciel.com/wp-content/themes/ddc/images/logo-ddc.svg',
  'dieu du ciel!': 'https://dieuduciel.com/wp-content/themes/ddc/images/logo-ddc.svg',
  'messorem bracitorium': 'https://messorem.co/wp-content/uploads/2020/09/Logo-Messorem-web.png',
  'messorem': 'https://messorem.co/wp-content/uploads/2020/09/Logo-Messorem-web.png',
  'brasserie du bas-canada': 'https://www.brasseriebascanada.com/wp-content/uploads/2021/04/logo-bas-canada.png',
  'bas-canada': 'https://www.brasseriebascanada.com/wp-content/uploads/2021/04/logo-bas-canada.png',
  'microbrasserie pit caribou': 'https://pitcaribou.com/wp-content/themes/pitcaribou/assets/images/logo-pitcaribou.png',
  'pit caribou': 'https://pitcaribou.com/wp-content/themes/pitcaribou/assets/images/logo-pitcaribou.png',
  'brasserie mellon': 'https://www.google.com/s2/favicons?domain=brasseriemellon.com&sz=128',
  'mellön': 'https://www.google.com/s2/favicons?domain=brasseriemellon.com&sz=128',
  'mellon brasserie': 'https://www.google.com/s2/favicons?domain=brasseriemellon.com&sz=128',
  'microbrasserie dunham': 'https://brasseriedunham.com/wp-content/uploads/2019/06/logo_dunham.png',
  'brasserie dunham': 'https://brasseriedunham.com/wp-content/uploads/2019/06/logo_dunham.png',
  'microbrasserie le trou du diable': 'https://troududiable.com/wp-content/themes/tdd/images/logo-tdd.svg',
  'le trou du diable': 'https://troududiable.com/wp-content/themes/tdd/images/logo-tdd.svg',
  'la barberie': 'https://www.labarberie.com/wp-content/themes/barberie/images/logo.png',
  'noctem artisans brasseurs': 'https://noctem.ca/wp-content/uploads/2021/03/logo-noctem.png',
  'griendel': 'https://www.google.com/s2/favicons?domain=griendel.com&sz=128',
  'siboire': 'https://siboire.ca/wp-content/themes/siboire/assets/img/logo-siboire.svg',
  'siboire depot': 'https://siboire.ca/wp-content/themes/siboire/assets/img/logo-siboire.svg',
  'siboire dépôt': 'https://siboire.ca/wp-content/themes/siboire/assets/img/logo-siboire.svg',
  'brasserie harricana': 'https://www.google.com/s2/favicons?domain=brasserieharricana.com&sz=128',
  'isle de garde': 'https://www.google.com/s2/favicons?domain=isledegarde.com&sz=128',
  "l'espace public": 'https://www.google.com/s2/favicons?domain=lespacepublic.ca&sz=128',
  'le bilboquet': 'https://www.google.com/s2/favicons?domain=lebilboquet.qc.ca&sz=128',
  'a la derive': 'https://www.google.com/s2/favicons?domain=aladerivebrasserie.ca&sz=128',
  'à la dérive brasserie artisanale': 'https://www.google.com/s2/favicons?domain=aladerivebrasserie.ca&sz=128',
  'les insulaires microbrasseurs': 'https://www.google.com/s2/favicons?domain=lesinsulaires.ca&sz=128',
  'microbrasserie le bockale': 'https://www.google.com/s2/favicons?domain=lebockale.com&sz=128',
  'le bockale': 'https://www.google.com/s2/favicons?domain=lebockale.com&sz=128',
  'le temps d’une pinte': 'https://www.google.com/s2/favicons?domain=letempsdunepinte.ca&sz=128',
  'microbrasserie riverbend': 'https://www.google.com/s2/favicons?domain=microbrasserieriverbend.com&sz=128',
  'la voie maltee': 'https://www.google.com/s2/favicons?domain=lavoiemaltee.com&sz=128',
  'la voie maltée': 'https://www.google.com/s2/favicons?domain=lavoiemaltee.com&sz=128',
  'lagabiere': 'https://www.google.com/s2/favicons?domain=lagabiere.com&sz=128',
  'lagabière': 'https://www.google.com/s2/favicons?domain=lagabiere.com&sz=128',
  'sutton brouerie': 'https://www.google.com/s2/favicons?domain=suttonbrouerie.com&sz=128',
  'sutton brouërie': 'https://www.google.com/s2/favicons?domain=suttonbrouerie.com&sz=128',
  'microbrasserie charlevoix': 'https://www.google.com/s2/favicons?domain=microbrasserie.com&sz=128',
  'brasserie beauregard': 'https://www.google.com/s2/favicons?domain=beauregardbrasserie.com&sz=128',
  'microbrasserie 5e baron': 'https://www.google.com/s2/favicons?domain=5ebaron.com&sz=128',
  'avant-garde artisans brasseurs': 'https://www.google.com/s2/favicons?domain=brasseriesavantgarde.com&sz=128',
  'robin biere naturelle': 'https://www.google.com/s2/favicons?domain=robinbierenaturelle.com&sz=128',
  'robin - bière naturelle': 'https://www.google.com/s2/favicons?domain=robinbierenaturelle.com&sz=128',

  // ===================== ONTARIO =====================
  'bellwoods brewery': 'https://www.bellwoodsbrewery.com/cdn/shop/files/Bellwoods_Logo.png',
  'blood brothers brewing': 'https://www.bloodbrothersbrewing.com/cdn/shop/files/Blood_Brothers_Logo.png',
  'left field brewery': 'https://www.leftfieldbrewery.ca/wp-content/uploads/2020/05/left-field-brewery-logo.png',
  'collective arts brewing': 'https://collectiveartsbrewing.com/cdn/shop/files/collective-arts-logo.svg',
  'dominion city brewing co.': 'https://www.dominioncity.ca/cdn/shop/files/DominionCity_Logo.png',
  'tooth and nail brewing company': 'https://www.toothandnailbeer.com/wp-content/uploads/2021/04/tandn-logo.png',
  'beyond the pale brewing co.': 'https://btpbeer.com/cdn/shop/files/btp-logo.png',
  'fairweather brewing company': 'https://fairweatherbrewing.com/wp-content/uploads/2020/04/fairweather-logo.png',
  'clifford brewing co.': 'https://cliffordbrewing.com/wp-content/uploads/2019/08/clifford-logo.png',
  'oast house brewers': 'https://oasthousebrewers.ca/wp-content/uploads/2021/04/oast-house-logo.png',
  'niagara oast house brewers': 'https://oasthousebrewers.ca/wp-content/uploads/2021/04/oast-house-logo.png',
  'silversmith brewing company': 'https://silversmithbrewing.com/wp-content/uploads/2020/05/silversmith-logo.png',
  'third moon brewing co.': 'https://thirdmoonbrewing.com/cdn/shop/files/third-moon-logo.png',
  'wellington brewery': 'https://www.wellingtonbrewery.ca/assets/images/wellington-logo.svg',
  'flying monkeys craft brewery': 'https://www.flyingmonkeys.ca/wp-content/uploads/2020/04/flying-monkeys-logo.png',
  'sleeping giant brewing co.': 'https://sleepinggiantbrewing.ca/wp-content/uploads/2021/05/sgb-logo.png',
  'muskoka brewery': 'https://muskokabrewery.com/wp-content/uploads/2020/04/muskoka-logo.svg',
  'sons of kent brewing co': 'https://sonsofkent.com/wp-content/uploads/2021/04/sok-logo.png',
  'sons of kent brewing co.': 'https://sonsofkent.com/wp-content/uploads/2021/04/sok-logo.png',
  'railway city brewing co': 'https://railwaycitybrewing.com/wp-content/uploads/2021/05/rcb-logo.png',
  'railway city brewing co.': 'https://railwaycitybrewing.com/wp-content/uploads/2021/05/rcb-logo.png',
  'upper thames brewing company': 'https://www.google.com/s2/favicons?domain=upperthamesbrewing.ca&sz=128',
  'slake brewing': 'https://www.google.com/s2/favicons?domain=slakebrewing.com&sz=128',
  'parsons brewing company': 'https://www.google.com/s2/favicons?domain=parsonsbrewing.com&sz=128',
  'stack brewing': 'https://www.google.com/s2/favicons?domain=stackbrewing.ca&sz=128',
  'badlands brewing company': 'https://www.google.com/s2/favicons?domain=badlandsbrewing.ca&sz=128',
  'goodlot farmstead brewing co': 'https://www.google.com/s2/favicons?domain=goodlot.beer&sz=128',
  'black swan brewing co': 'https://www.google.com/s2/favicons?domain=blackswanbrewing.ca&sz=128',
  'rurban brewing': 'https://www.google.com/s2/favicons?domain=rurbanbrewing.ca&sz=128',
  'wood brothers brewing company': 'https://www.google.com/s2/favicons?domain=woodbrothersbrewing.com&sz=128',
  'mudtown station brewery': 'https://www.google.com/s2/favicons?domain=mudtownstation.ca&sz=128',
  '1000 islands brewing company': 'https://www.google.com/s2/favicons?domain=1000islandsbrewery.ca&sz=128',
  'ganaraska brewing company': 'https://www.google.com/s2/favicons?domain=ganaraskabrewingcompany.ca&sz=128',
  'lake of the woods brewing company': 'https://www.google.com/s2/favicons?domain=lowbrewco.com&sz=128',
  'full beard brewing co': 'https://www.google.com/s2/favicons?domain=fullbeardbrewing.com&sz=128',
  'quayle’s brewery': 'https://www.google.com/s2/favicons?domain=quaylesbrewery.ca&sz=128',
  'canvas brewing co': 'https://www.google.com/s2/favicons?domain=canvasbrewing.com&sz=128',
  'side launch brewing company': 'https://www.google.com/s2/favicons?domain=sidelaunchbrewing.com&sz=128',
  'the collingwood brewery': 'https://www.google.com/s2/favicons?domain=thecollingwoodbrewery.com&sz=128',
  'refined fool brewing co.': 'https://www.google.com/s2/favicons?domain=refinedfool.com&sz=128',
  'refine fool brewing co.': 'https://www.google.com/s2/favicons?domain=refinedfool.com&sz=128',
  'northern superior brewing co.': 'https://www.google.com/s2/favicons?domain=northernsuperior.org&sz=128',
  'gateway city brewery': 'https://www.google.com/s2/favicons?domain=gatewaycity.ca&sz=128',
  'new limburg brewing company': 'https://www.google.com/s2/favicons?domain=newlimburg.com&sz=128',
  'forked river brewing company': 'https://www.google.com/s2/favicons?domain=forkedriverbrewing.com&sz=128',
  'merit brewing company': 'https://www.google.com/s2/favicons?domain=meritbrewing.ca&sz=128',
  'innocente brewing company': 'https://www.google.com/s2/favicons?domain=innocente.ca&sz=128',
  'block three brewing co.': 'https://www.google.com/s2/favicons?domain=blockthreebrewing.com&sz=128',
  'twb brewing co-operative': 'https://www.google.com/s2/favicons?domain=twbbrewing.com&sz=128',
  'cameron\'s brewing company': 'https://www.google.com/s2/favicons?domain=cameronsbrewing.com&sz=128',
  'nickel brook brewing co.': 'https://www.google.com/s2/favicons?domain=nickelbrook.com&sz=128',
  'stonehooker brewing company': 'https://www.google.com/s2/favicons?domain=stonehooker.com&sz=128',
  'rouge river brewing company': 'https://www.google.com/s2/favicons?domain=rougeriverbrewingcompany.com&sz=128',
  'market brewing company': 'https://www.google.com/s2/favicons?domain=marketbrewingco.com&sz=128',
  'town brewery': 'https://www.google.com/s2/favicons?domain=townbrewery.ca&sz=128',
  '5 paddles brewing co.': 'https://www.google.com/s2/favicons?domain=5paddlesbrewing.com&sz=128',
  'furnace room brewery': 'https://www.google.com/s2/favicons?domain=furnaceroombrewery.ca&sz=128',
  'elora brewing company': 'https://www.google.com/s2/favicons?domain=elorabrewingcompany.ecwid.com&sz=128',
  'bayside brewing co.': 'https://www.google.com/s2/favicons?domain=baysidebrewing.com&sz=128',
  'frank brewing co.': 'https://www.google.com/s2/favicons?domain=frankbeer.ca&sz=128',
  'gl heritage brewing co.': 'https://www.google.com/s2/favicons?domain=glheritagebrewing.ca&sz=128',
  'banded goose brewing co.': 'https://www.google.com/s2/favicons?domain=bandedgoosebrewing.com&sz=128',
  'counterpart brewing': 'https://www.google.com/s2/favicons?domain=counterpartbrewing.com&sz=128',
  'blackburn brewhouse': 'https://www.google.com/s2/favicons?domain=blackburnbrewhouse.com&sz=128',
  'bench brewing company': 'https://www.google.com/s2/favicons?domain=benchbrewing.com&sz=128',
  'the exchange brewery': 'https://www.google.com/s2/favicons?domain=exchangebrewery.com&sz=128',
  'lock street brewing company': 'https://www.google.com/s2/favicons?domain=lockstreet.ca&sz=128',
  'the merchant ale house': 'https://www.google.com/s2/favicons?domain=merchantalehouse.com&sz=128',
  'skeleton park brewery': 'https://www.google.com/s2/favicons?domain=skeletonparkbrewery.ca&sz=128',
  'daft brewing': 'https://www.google.com/s2/favicons?domain=daftbrewing.com&sz=128',
  'fine balance brewing company': 'https://www.google.com/s2/favicons?domain=finebalancebrewing.ca&sz=128',
  'spearhead brewing company': 'https://www.google.com/s2/favicons?domain=spearheadbeer.com&sz=128',
  'signal brewing company': 'https://www.google.com/s2/favicons?domain=signalbrewery.com&sz=128',
  'meyers creek brewing company': 'https://www.google.com/s2/favicons?domain=meyerscreekbrewing.ca&sz=128',
  'publican house brewery': 'https://www.google.com/s2/favicons?domain=publicanhouse.com&sz=128',
  'haven brewing company': 'https://www.google.com/s2/favicons?domain=havenbrewing.ca&sz=128',
  'pie eyed monk brewery': 'https://www.google.com/s2/favicons?domain=pieeyedmonkbrewery.com&sz=128',
  'grounded brewery': 'https://www.google.com/s2/favicons?domain=groundedbrewery.ca&sz=128',
  'braumeister brewing co.': 'https://www.google.com/s2/favicons?domain=braumeister.ca&sz=128',
  'crooked mile brewing co.': 'https://www.google.com/s2/favicons?domain=crookedmile.ca&sz=128',
  'square timber brewing company': 'https://www.google.com/s2/favicons?domain=squaretimber.com&sz=128',
  'whitewater brewing co.': 'https://www.google.com/s2/favicons?domain=whitewaterbeer.ca&sz=128',
  'sawdust city brewing co.': 'https://www.google.com/s2/favicons?domain=sawdustcitybrewing.com&sz=128',
  'black bellows brewing co.': 'https://www.google.com/s2/favicons?domain=blackbellows.com&sz=128',
  'couchiching craft brewing co.': 'https://www.google.com/s2/favicons?domain=couchichingbrew.com&sz=128',
  'great lakes brewery': 'https://www.google.com/s2/favicons?domain=greatlakesbeer.com&sz=128',
  'steam whistle brewing': 'https://www.google.com/s2/favicons?domain=steamwhistle.ca&sz=128',
  'amsterdam brewing co.': 'https://www.google.com/s2/favicons?domain=amsterdambeer.com&sz=128',
  'henderson brewing co.': 'https://www.google.com/s2/favicons?domain=hendersonbrewing.com&sz=128',
  'halo brewery': 'https://www.google.com/s2/favicons?domain=halobrewery.com&sz=128',
  'brimstone brewing company': 'https://www.google.com/s2/favicons?domain=brimstonebrewing.ca&sz=128',
  'breakwall brewing company': 'https://www.google.com/s2/favicons?domain=breakwallbrewery.com&sz=128',
  'kame & kettle beer works': 'https://www.google.com/s2/favicons?domain=kameandkettle.ca&sz=128',
  'meuse brewing company': 'https://www.google.com/s2/favicons?domain=meusebrewing.com&sz=128',
  'prince eddy\'s brewing co.': 'https://www.google.com/s2/favicons?domain=princeeddys.com&sz=128',
  'wild card brewing company': 'https://www.google.com/s2/favicons?domain=wildcardbrewing.ca&sz=128',
  'northumberland hills brewery': 'https://www.google.com/s2/favicons?domain=nhb.beer&sz=128',
  'manantler craft brewing co.': 'https://www.google.com/s2/favicons?domain=manantler.com&sz=128',
  'all or nothing brewhouse': 'https://www.google.com/s2/favicons?domain=allornothing.beer&sz=128',
  'walkerville brewery': 'https://www.google.com/s2/favicons?domain=walkervillebrewery.com&sz=128',

  // ===================== NEW YORK =====================
  'other half brewing': 'https://otherhalfbrewing.com/wp-content/uploads/2020/05/other-half-logo.svg',
  'evil twin brewing nyc': 'https://eviltwin.nyc/wp-content/uploads/2020/05/evil-twin-logo.png',
  'singlecut beersmiths': 'https://singlecut.com/wp-content/themes/singlecut/assets/img/logo.svg',
  'grimm artisanal ales': 'https://grimmales.com/wp-content/uploads/2021/04/grimm-logo.png',
  'brooklyn brewery': 'https://brooklynbrewery.com/wp-content/themes/brooklyn-brewery/assets/images/logo.svg',
  'equilibrium brewery': 'https://www.eqbrew.com/wp-content/uploads/2020/05/equilibrium-logo.png',
  'the drowned lands brewery': 'https://www.drownedlands.beer/wp-content/uploads/2020/05/drowned-lands-logo.png',
  'hudson valley brewery': 'https://hudsonvalleybrewery.com/wp-content/uploads/2020/05/hvb-logo.png',
  'industrial arts brewing company': 'https://www.industrialartsbrewing.com/wp-content/themes/iabc/images/logo.png',
  'fidens brewing company': 'https://www.fidensbrewing.com/wp-content/uploads/2021/04/fidens-logo.png',
  'mortalis brewing company': 'https://www.mortalisbrewing.com/wp-content/uploads/2021/04/mortalis-logo.png',
  'suarez family brewery': 'https://suarezfamilybrewery.com/wp-content/uploads/2020/05/suarez-logo.png',
  'prison city brewing': 'https://www.google.com/s2/favicons?domain=prisoncitybrewing.com&sz=128',
  'genesee brewing company': 'https://www.google.com/s2/favicons?domain=geneseebeer.com&sz=128',
  'finback brewery': 'https://www.google.com/s2/favicons?domain=finbackbrewery.com&sz=128',
  'threes brewing': 'https://www.google.com/s2/favicons?domain=threesbrewing.com&sz=128',
  'gun hill brewing company': 'https://www.google.com/s2/favicons?domain=gunhillbrewing.com&sz=128',
  'bronx brewery': 'https://www.google.com/s2/favicons?domain=thebronxbrewery.com&sz=128',
  'saranac brewery': 'https://www.google.com/s2/favicons?domain=saranac.com&sz=128',
  'southern tier brewing company': 'https://www.google.com/s2/favicons?domain=stbcbeer.com&sz=128',
  'ithaca beer co.': 'https://www.google.com/s2/favicons?domain=ithacabeer.com&sz=128',
  'brewery ommegang': 'https://www.google.com/s2/favicons?domain=ommegang.com&sz=128',
  'brewery ardennes': 'https://www.google.com/s2/favicons?domain=breweryardennes.com&sz=128',
  'sloop brewing co.': 'https://www.google.com/s2/favicons?domain=sloopbrewing.com&sz=128',
  'captain lawrence brewing co.': 'https://www.google.com/s2/favicons?domain=captainlawrencebrewing.com&sz=128',
  'west kill brewing': 'https://www.google.com/s2/favicons?domain=westkillbrewing.com&sz=128',
  'kings county brewers collective': 'https://www.google.com/s2/favicons?domain=kcbcbeer.com&sz=128',
  'talea beer co.': 'https://www.google.com/s2/favicons?domain=taleabeer.com&sz=128',
  'wild east brewing co.': 'https://www.google.com/s2/favicons?domain=wildeastbrewing.com&sz=128',
  'big ditch brewing company': 'https://www.google.com/s2/favicons?domain=bigditchbrewing.com&sz=128',
  'community beer works': 'https://www.google.com/s2/favicons?domain=communitybeerworks.com&sz=128',
  'resurgence brewing company': 'https://www.google.com/s2/favicons?domain=resurgencebrewing.com&sz=128',
  'thin man brewery': 'https://www.google.com/s2/favicons?domain=thinmanbrewery.com&sz=128',
  'rohrbach brewing company': 'https://www.google.com/s2/favicons?domain=rohrbachs.com&sz=128',
  'swiftwater brewing co.': 'https://www.google.com/s2/favicons?domain=swiftwaterbrewing.com&sz=128',
  'k2 brothers brewing': 'https://www.google.com/s2/favicons?domain=k2brewing.com&sz=128',
  'talking cursive brewing company': 'https://www.google.com/s2/favicons?domain=talkingcursive.com&sz=128',
  'middleages brewing company': 'https://www.google.com/s2/favicons?domain=middleagesbrewing.com&sz=128',
  'meier\'s creek brewing company': 'https://www.google.com/s2/favicons?domain=meierscreekbrewing.com&sz=128',
  'underground beer lab': 'https://www.google.com/s2/favicons?domain=undergroundbeerlab.com&sz=128',
  'aurora brewing co.': 'https://www.google.com/s2/favicons?domain=aurorabrewingco.com&sz=128',
  'lucky hare brewing company': 'https://www.google.com/s2/favicons?domain=luckyharebrewing.com&sz=128',
  'two goats brewing': 'https://www.google.com/s2/favicons?domain=twogoatsbrewing.com&sz=128',
  'upstate brewing company': 'https://www.google.com/s2/favicons?domain=upstatebrewing.com&sz=128',
  'liquid state brewing company': 'https://www.google.com/s2/favicons?domain=liquidstatebeer.com&sz=128',
  'rare form brewing company': 'https://www.google.com/s2/favicons?domain=rareformbrewing.com&sz=128',
  'brown\'s brewing company': 'https://www.google.com/s2/favicons?domain=brownsbrewing.com&sz=128',
  'wolf hollow brewing company': 'https://www.google.com/s2/favicons?domain=wolfhollowbrewing.com&sz=128',
  'frog alley brewing': 'https://www.google.com/s2/favicons?domain=frogalleybrewing.com&sz=128',
};

/**
 * Returns a high-resolution logo URL for any brewery stop.
 * 1. Explicit brewery.logoUrl
 * 2. Curated logo database for Vermont, Quebec, Ontario, New York
 * 3. Official 128px high-res domain favicon service from Google
 */
export function getBreweryLogoUrl(brewery: { name: string; websiteUrl?: string; logoUrl?: string }): string | null {
  if (brewery.logoUrl) return brewery.logoUrl;

  const cleanName = brewery.name.toLowerCase().trim();
  if (CURATED_BREWERY_LOGOS[cleanName]) {
    return CURATED_BREWERY_LOGOS[cleanName];
  }

  // Check partial matches in curated map
  for (const [key, logoUrl] of Object.entries(CURATED_BREWERY_LOGOS)) {
    if (cleanName.includes(key) || key.includes(cleanName)) {
      return logoUrl;
    }
  }

  // Domain favicon fallback (128x128 high resolution)
  const domain = getDomainFromUrl(brewery.websiteUrl);
  if (domain) {
    return `https://www.google.com/s2/favicons?domain=${domain}&sz=128`;
  }

  return null;
}
