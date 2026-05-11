export interface PricingInputs {
  productName: string
  price: number
  productCost: number
  packagingCost: number
  shippingSubsidy: number
  platformFeePercent: number
  adCost: number
  discount: number
  affiliatePercent: number
  returnRatePercent: number
  targetMarginPercent: number
}

export type ProfitStatus = 'loss' | 'thin' | 'fair' | 'healthy'

export interface PricingResults {
  platformFee: number
  affiliateFee: number
  returnRiskCost: number
  totalCost: number
  profit: number
  margin: number
  netRevenue: number
  breakEvenPrice: number
  competitivePrice: number
  balancedPrice: number
  premiumPrice: number
  status: ProfitStatus
  statusLabel: string
  statusMessage: string
  recommendation: string
  profitHealthScore: number
}

export const DEFAULT_INPUTS: PricingInputs = {
  productName: '',
  price: 350,
  productCost: 150,
  packagingCost: 15,
  shippingSubsidy: 40,
  platformFeePercent: 5,
  adCost: 20,
  discount: 0,
  affiliatePercent: 0,
  returnRatePercent: 2,
  targetMarginPercent: 25,
}

function round2(n: number): number {
  return Math.round(n * 100) / 100
}

function priceForMargin(
  fixedCosts: number,
  percentageFees: number,
  marginTarget: number
): number {
  const denominator = 1 - percentageFees / 100 - marginTarget / 100
  if (denominator <= 0) return Infinity
  return round2(fixedCosts / denominator)
}

export function calculate(inputs: PricingInputs): PricingResults {
  const {
    price,
    productCost,
    packagingCost,
    shippingSubsidy,
    platformFeePercent,
    adCost,
    discount,
    affiliatePercent,
    returnRatePercent,
    targetMarginPercent,
  } = inputs

  const platformFee = round2((price * platformFeePercent) / 100)
  const affiliateFee = round2((price * affiliatePercent) / 100)
  const returnRiskCost = round2((productCost * returnRatePercent) / 100)

  const fixedCosts =
    productCost + packagingCost + shippingSubsidy + adCost + discount + returnRiskCost

  const totalCost = round2(fixedCosts + platformFee + affiliateFee)
  const profit = round2(price - totalCost)
  const margin = price > 0 ? round2((profit / price) * 100) : 0
  const netRevenue = round2(price - discount - platformFee - affiliateFee)

  const percentageFeeTotal = platformFeePercent + affiliatePercent
  const breakEvenPrice = round2(
    priceForMargin(fixedCosts, percentageFeeTotal, 0)
  )
  const competitivePrice = round2(priceForMargin(fixedCosts, percentageFeeTotal, 15))
  const balancedPrice = round2(
    priceForMargin(fixedCosts, percentageFeeTotal, targetMarginPercent)
  )
  const premiumPrice = round2(
    priceForMargin(fixedCosts, percentageFeeTotal, targetMarginPercent + 15)
  )

  let status: ProfitStatus
  let statusLabel: string
  let statusMessage: string
  let recommendation: string

  if (margin < 0) {
    status = 'loss'
    statusLabel = 'เสี่ยงขาดทุน'
    statusMessage = `ราคานี้ขาดทุน ${Math.abs(profit).toFixed(0)} บาทต่อชิ้น ต้องปรับโดยด่วน`
    recommendation = `ขึ้นราคาขายให้อยู่ที่อย่างน้อย ฿${breakEvenPrice.toFixed(0)} เพื่อไม่ขาดทุน หรือลดต้นทุนสินค้าและค่าแพ็กของลง`
  } else if (margin < 10) {
    status = 'thin'
    statusLabel = 'กำไรบางมาก'
    statusMessage = `Margin ${margin.toFixed(1)}% บางเกินไป ความเสี่ยงสูงถ้ามีโปรหรือของเสีย`
    recommendation = `ควรตั้งราคาให้ได้ margin อย่างน้อย 15% คือประมาณ ฿${competitivePrice.toFixed(0)} ก่อนคิดโปรโมชันใดๆ`
  } else if (margin < 25) {
    status = 'fair'
    statusLabel = 'พอใช้ ระวังโปร'
    statusMessage = `Margin ${margin.toFixed(1)}% ใช้ได้ แต่ถ้าลงโปรหรือมีของเสียจะเสี่ยงทันที`
    recommendation = `หลีกเลี่ยงโปรที่ลดเกิน ${Math.floor(margin - 5)}% และให้สต็อกสินค้าให้พอดีเพื่อลดความเสี่ยงของเสีย`
  } else {
    status = 'healthy'
    statusLabel = 'สุขภาพดี'
    statusMessage = `Margin ${margin.toFixed(1)}% แข็งแกร่ง มีพื้นที่รองรับโปรและความเสี่ยงได้ดี`
    recommendation = `รักษาระดับนี้ไว้ และสามารถใช้ส่วนต่างออกแบบโปรโมชันได้อย่างมีกลยุทธ์`
  }

  const rawScore = Math.max(0, Math.min(100, margin * 2.5 + 25))
  const profitHealthScore = Math.round(rawScore)

  return {
    platformFee,
    affiliateFee,
    returnRiskCost,
    totalCost,
    profit,
    margin,
    netRevenue,
    breakEvenPrice,
    competitivePrice,
    balancedPrice,
    premiumPrice,
    status,
    statusLabel,
    statusMessage,
    recommendation,
    profitHealthScore,
  }
}

export interface PromotionResult {
  type: string
  label: string
  profit: number
  margin: number
  status: ProfitStatus
  statusLabel: string
  advice: string
  extraUnitsSold?: number
}

export function simulatePromotion(
  base: PricingResults,
  inputs: PricingInputs,
  promoType: string
): PromotionResult {
  let adjustedPrice = inputs.price
  let adjustedDiscount = inputs.discount
  let adjustedShipping = inputs.shippingSubsidy
  let adjustedAffiliate = inputs.affiliatePercent

  switch (promoType) {
    case 'discount10':
      adjustedDiscount += inputs.price * 0.1
      break
    case 'freeship30':
      adjustedShipping += 30
      break
    case 'affiliate10':
      adjustedAffiliate += 10
      break
    case 'flashsale20':
      adjustedDiscount += inputs.price * 0.2
      break
    case 'bundle2': {
      const bundleDiscount = inputs.price * 0.1
      adjustedDiscount += bundleDiscount
      break
    }
  }

  const newInputs: PricingInputs = {
    ...inputs,
    price: adjustedPrice,
    discount: adjustedDiscount,
    shippingSubsidy: adjustedShipping,
    affiliatePercent: adjustedAffiliate,
  }
  const result = calculate(newInputs)

  let status: ProfitStatus = result.status
  let statusLabel = result.statusLabel
  let advice = ''

  const profitDrop = base.profit - result.profit
  const extraUnits =
    result.profit > 0
      ? Math.ceil(profitDrop / result.profit)
      : undefined

  switch (promoType) {
    case 'discount10':
      if (result.margin < 0) {
        advice = 'โปรลด 10% นี้ขาดทุน ไม่ควรใช้เว้นแต่เคลียร์สต็อก'
      } else if (result.margin < 15) {
        advice = 'โปรนี้ยังรอด แต่กำไรบาง ควรตั้งราคาปกติสูงขึ้นก่อนปล่อยคูปอง'
      } else {
        advice = 'โปรลด 10% ยังได้กำไรดี เหมาะใช้ดึงยอดขายช่วง peak'
      }
      break
    case 'freeship30':
      if (result.profit < 0) {
        advice = 'ส่งฟรี 30 บาททำให้ขาดทุน ควรตั้งราคาขายขึ้นอีก 30-50 บาทก่อน'
      } else {
        advice = 'ส่งฟรียังพอรับได้ แต่ควรตั้งเป็นเงื่อนไขซื้อขั้นต่ำ ไม่ใช่ทุก order'
      }
      break
    case 'affiliate10':
      if (result.margin < 10) {
        advice = 'ค่าคอม 10% ทำให้กำไรบางมาก ควรปรับราคาขายขึ้นก่อนเปิด affiliate'
      } else {
        advice = 'ค่าคอม affiliate 10% ยังรับได้ถ้า affiliate ช่วยดึง traffic ใหม่'
      }
      break
    case 'flashsale20':
      if (result.profit < 0) {
        advice = 'Flash Sale 20% นี้ขาดทุน ไม่ควรใช้เว้นแต่มีเป้าหมายเคลียร์สต็อกชัดเจน'
      } else if (result.margin < 10) {
        advice = 'Flash Sale รอดแต่บางมาก ใช้ได้เฉพาะช่วงเคลียร์สต็อกหรือ campaign ใหญ่เท่านั้น'
      } else {
        advice = 'Flash Sale 20% ยังได้กำไร เหมาะสำหรับสร้าง momentum ยอดขาย'
      }
      break
    case 'bundle2':
      if (result.margin < 10) {
        advice = 'Bundle 2 ชิ้นกำไรบาง ควรปรับราคา bundle ให้สูงขึ้นหรือลดต้นทุนบรรจุภัณฑ์'
      } else {
        advice = 'Bundle 2 ชิ้นดีมาก ช่วยเพิ่มยอดต่อออเดอร์โดยยังกำไรดี'
      }
      break
  }

  const labelMap: Record<string, string> = {
    discount10: 'ลด 10%',
    freeship30: 'ส่งฟรี 30 บาท',
    affiliate10: 'คอม Affiliate 10%',
    flashsale20: 'Flash Sale ลด 20%',
    bundle2: 'Bundle 2 ชิ้น',
  }

  return {
    type: promoType,
    label: labelMap[promoType] || promoType,
    profit: result.profit,
    margin: result.margin,
    status,
    statusLabel,
    advice,
    extraUnitsSold: extraUnits,
  }
}

export interface PriceWarResult {
  profitIfMatch: number
  marginIfMatch: number
  statusIfMatch: ProfitStatus
  profitLoss: number
  extraUnitsNeeded: number | null
  recommendation: 'match' | 'bundle' | 'value' | 'impossible'
  advice: string[]
}

export function simulatePriceWar(
  inputs: PricingInputs,
  competitorPrice: number
): PriceWarResult {
  const matchedInputs: PricingInputs = { ...inputs, price: competitorPrice }
  const matchedResult = calculate(matchedInputs)
  const currentResult = calculate(inputs)

  const profitLoss = round2(currentResult.profit - matchedResult.profit)

  let extraUnitsNeeded: number | null = null
  if (matchedResult.profit > 0 && profitLoss > 0) {
    extraUnitsNeeded = Math.ceil(
      (currentResult.profit * 1) / matchedResult.profit
    )
  }

  let recommendation: PriceWarResult['recommendation']
  const advice: string[] = []

  if (matchedResult.profit < 0) {
    recommendation = 'impossible'
    advice.push(`ถ้าลดตามราคา ฿${competitorPrice} จะขาดทุน ${Math.abs(matchedResult.profit).toFixed(0)} บาทต่อชิ้น`)
    advice.push('อย่าลดราคาตามคู่แข่งโดยเด็ดขาด เพราะยิ่งขายยิ่งขาดทุน')
    advice.push('ให้เน้นสร้างคุณค่าที่แตกต่าง เช่น แพ็กสวย ส่งไว รับประกัน บริการหลังขาย')
  } else if (matchedResult.margin < 10) {
    recommendation = 'bundle'
    advice.push(`ลดตามได้แต่กำไรเหลือแค่ ${matchedResult.margin.toFixed(1)}% — เสี่ยงมากถ้ามีโปรหรือของเสีย`)
    advice.push('แนะนำให้ทำ bundle แทนการลดราคาตรงๆ เช่น ซื้อ 2 แถม gift หรือเพิ่ม free gift เล็กๆ')
    advice.push('Bundle ช่วยรักษาราคาปกติและมูลค่าแบรนด์ไว้ในระยะยาว')
  } else if (matchedResult.margin < 20) {
    recommendation = 'value'
    advice.push(`ลดตามได้ กำไร ${matchedResult.margin.toFixed(1)}% แต่ margin บางกว่าปัจจุบัน`)
    advice.push('พิจารณาสื่อสารคุณค่าของสินค้าให้ชัดขึ้น ก่อนตัดสินใจลดราคาตาม')
    advice.push('ลองเพิ่ม social proof เช่น รีวิว rating ก่อน — ลูกค้าหลายคนยอมจ่ายมากกว่าเพื่อความมั่นใจ')
  } else {
    recommendation = 'match'
    advice.push(`ลดตามราคา ฿${competitorPrice} ได้ กำไรยังดีอยู่ที่ ${matchedResult.margin.toFixed(1)}%`)
    advice.push('แต่ถ้าไม่จำเป็น ควรรักษาราคาเดิมไว้ดีกว่า เพราะสงครามราคามักจบไม่ดีสำหรับทุกฝ่าย')
  }

  return {
    profitIfMatch: matchedResult.profit,
    marginIfMatch: matchedResult.margin,
    statusIfMatch: matchedResult.status,
    profitLoss,
    extraUnitsNeeded,
    recommendation,
    advice,
  }
}

export interface ValueMessage {
  type: 'reply' | 'caption' | 'reason'
  label: string
  text: string
}

export function generateValueMessages(
  inputs: PricingInputs,
  _results: PricingResults
): ValueMessage[] {
  const { productName, price } = inputs
  const name = productName || 'สินค้านี้'
  const hasPackaging = inputs.packagingCost > 0
  const hasQA = inputs.returnRatePercent > 0
  const hasFastShip = inputs.shippingSubsidy > 0

  const qualityPoints: string[] = []
  if (hasPackaging) qualityPoints.push('แพ็กอย่างดี')
  if (hasFastShip) qualityPoints.push('ส่งไว')
  if (hasQA) qualityPoints.push('ผ่านการคัดเกรด')
  qualityPoints.push('บริการหลังการขายจริง')

  const qualityStr = qualityPoints.join(' ')

  const messages: ValueMessage[] = [
    {
      type: 'reply',
      label: 'ตอบลูกค้าต่อราคา',
      text: `ขอบคุณที่สนใจค่ะ/ครับ ราคา ฿${price.toFixed(0)} นี้รวม${qualityStr}แล้วนะคะ/ครับ ${name}ของเราคัดมาเพื่อให้ลูกค้าได้ของที่ใช้งานได้จริง ไม่ใช่แค่ถูก ถ้ามีคำถามเพิ่มเติมยินดีตอบทุกข้อเลยค่ะ/ครับ`,
    },
    {
      type: 'caption',
      label: 'แคปชันขายเน้นคุณค่า',
      text: `✦ ${name} — ราคาที่คุ้มกว่าที่คิด\n\nไม่ใช่แค่ถูกที่สุด แต่คุ้มที่สุด\n${qualityStr} ทุก order\nรับประกันถ้ามีปัญหา\n\n฿${price.toFixed(0)} เท่านั้น — คุณค่าคือสิ่งที่ราคาถูกให้ไม่ได้`,
    },
    {
      type: 'reason',
      label: 'เหตุผลที่คุ้มกว่าของถูก',
      text: `ราคานี้อาจไม่ถูกที่สุดในตลาด แต่คุ้มกว่าสำหรับลูกค้าที่ต้องการ: (1) ${qualityStr} (2) ลดความเสี่ยงซื้อแล้วใช้งานไม่ได้ (3) ประหยัดเวลาคืนสินค้าและรอของใหม่ ราคาที่แตกต่างกัน ${Math.max(20, Math.round(price * 0.1))} บาทนั้นน้อยมากเมื่อเทียบกับความเสี่ยงที่หายไป`,
    },
  ]

  return messages
}

// ============================================================
// Selling Price Optimizer — Psychological Pricing
// ============================================================

export type PricingStrategy = 'charm' | 'round' | 'threshold' | 'lucky' | 'bundle'

export interface SellingPriceSuggestion {
  strategy: PricingStrategy
  label: string
  badge: string
  icon: string
  price: number
  profit: number
  margin: number
  status: ProfitStatus
  statusLabel: string
  psychology: string
  whyItWorks: string
  bestFor: string
  highlight: boolean
}

function findCharmPrice(target: number): number {
  if (target <= 0) return 9
  if (target < 50) {
    const rounded = Math.max(10, Math.round(target / 10) * 10)
    return rounded - 1
  }
  if (target < 200) {
    const rounded = Math.round(target / 10) * 10
    return Math.max(19, rounded - 1)
  }
  if (target < 2000) {
    const rounded = Math.round(target / 100) * 100
    return Math.max(99, rounded - 1)
  }
  // For ≥ 2000, use x999
  const rounded = Math.round(target / 1000) * 1000
  return rounded - 1
}

function findRoundPrice(target: number): number {
  if (target <= 0) return 50
  if (target < 100) return Math.max(50, Math.round(target / 10) * 10)
  if (target < 500) return Math.round(target / 50) * 50
  if (target < 1500) return Math.round(target / 100) * 100
  if (target < 5000) return Math.round(target / 500) * 500
  return Math.round(target / 1000) * 1000
}

function findThresholdPrice(target: number): number {
  const thresholds = [50, 99, 149, 199, 299, 399, 499, 699, 999, 1499, 1999, 2999, 4999, 9999]
  for (const t of thresholds) {
    if (t >= target * 0.85 && t <= target * 1.05) return t
  }
  // Otherwise find closest threshold within range
  let closest = thresholds[0]
  let minDiff = Math.abs(target - closest)
  for (const t of thresholds) {
    const diff = Math.abs(target - t)
    if (diff < minDiff) {
      closest = t
      minDiff = diff
    }
  }
  return closest
}

function findLuckyPrice(target: number): number {
  if (target <= 0) return 9
  // End in 9 (Thai lucky number for sales). Add a small premium (~3-7%)
  const bumped = target * 1.05
  if (bumped < 100) {
    const tens = Math.round(bumped / 10) * 10
    return tens + 9
  }
  if (bumped < 1000) {
    const hundreds = Math.round(bumped / 100) * 100
    return hundreds + 89
  }
  const thousands = Math.round(bumped / 1000) * 1000
  return thousands + 899
}

function findBundlePrice(target: number): number {
  // 2-unit bundle with ~10% off per unit appearance
  const raw = target * 1.85
  return findCharmPrice(raw)
}

function calculateAtPrice(inputs: PricingInputs, price: number): {
  profit: number
  margin: number
  status: ProfitStatus
  statusLabel: string
} {
  const r = calculate({ ...inputs, price })
  return { profit: r.profit, margin: r.margin, status: r.status, statusLabel: r.statusLabel }
}

export function generateSellingPrices(inputs: PricingInputs): SellingPriceSuggestion[] {
  const target = inputs.price > 0 ? inputs.price : 350

  const charm = findCharmPrice(target)
  const round = findRoundPrice(target)
  const threshold = findThresholdPrice(target)
  const lucky = findLuckyPrice(target)
  const bundle = findBundlePrice(target)

  const suggestions: SellingPriceSuggestion[] = [
    {
      strategy: 'charm',
      label: 'ราคาดึงดูด',
      badge: 'ขายดีที่สุด',
      icon: '🪝',
      price: charm,
      ...calculateAtPrice(inputs, charm),
      psychology: 'Charm Pricing — ราคาลงท้ายด้วยเลข 9',
      whyItWorks: `ลูกค้ามองข้ามหลักหน่วยอัตโนมัติ — ฿${charm} รู้สึกเหมือน "฿${Math.floor(charm / 100) * 100}+" ไม่ใช่ "฿${Math.ceil(charm / 100) * 100}" งานวิจัยแสดงว่าราคาลงท้าย 9 ขายดีกว่า 24%`,
      bestFor: 'สินค้า mass market, marketplace, ของกินของใช้',
      highlight: true,
    },
    {
      strategy: 'threshold',
      label: 'ใต้จุดต้านทาน',
      badge: 'จิตวิทยาแรง',
      icon: '🎯',
      price: threshold,
      ...calculateAtPrice(inputs, threshold),
      psychology: 'Below-Threshold — หลบเส้นจิตวิทยาราคา',
      whyItWorks: `฿${threshold} อยู่ใต้เส้น "ราคาเกิน ${Math.ceil((threshold + 1) / 100) * 100}" ที่ลูกค้าตั้งไว้ในใจ ทำให้ตัดสินใจซื้อง่ายขึ้นมาก เหมาะใส่ใน ads ที่ต้อง catch attention`,
      bestFor: 'สินค้า impulse buy, ads campaign, flash sale',
      highlight: false,
    },
    {
      strategy: 'round',
      label: 'ราคาพรีเมียม',
      badge: 'พรีเมียม',
      icon: '👑',
      price: round,
      ...calculateAtPrice(inputs, round),
      psychology: 'Round Pricing — เลขกลม สื่อคุณภาพ',
      whyItWorks: `฿${round} ดูสะอาด มั่นใจ ไม่ "พยายามขาย" เหมาะกับแบรนด์ที่ต้องการสื่อคุณภาพ ลูกค้าระดับกลาง-บนชอบราคาแบบนี้มากกว่า`,
      bestFor: 'แบรนด์พรีเมียม, สินค้าคุณภาพสูง, ของขวัญ',
      highlight: false,
    },
    {
      strategy: 'lucky',
      label: 'เลขมงคลไทย',
      badge: 'นำโชค',
      icon: '🍀',
      price: lucky,
      ...calculateAtPrice(inputs, lucky),
      psychology: 'Lucky Number — ลงท้าย 9 (ก้าวหน้า)',
      whyItWorks: `฿${lucky} ลงท้ายด้วย 9 ที่คนไทยถือว่าเป็นเลขมงคล (สื่อความก้าวหน้า) เหมาะกับสินค้าที่กลุ่มเป้าหมายเชื่อเรื่องเลข เช่น เครื่องประดับ ของฝาก ของมงคล`,
      bestFor: 'สินค้ามงคล, ของฝาก, ตลาดผู้ใหญ่',
      highlight: false,
    },
    {
      strategy: 'bundle',
      label: 'ราคา Bundle 2 ชิ้น',
      badge: 'เพิ่ม AOV',
      icon: '📦',
      price: bundle,
      ...calculateAtPrice({ ...inputs, productCost: inputs.productCost * 2, packagingCost: inputs.packagingCost * 1.5 }, bundle),
      psychology: 'Bundle Pricing — ขายเป็นแพ็ก',
      whyItWorks: `ขายชุด 2 ชิ้นที่ ฿${bundle} ทำให้ดูคุ้มต่อชิ้น (฿${Math.round(bundle / 2)}/ชิ้น) ลูกค้าซื้อมากขึ้น = ลดต้นทุนค่าส่ง+ค่าแอดต่อหน่วย กำไรรวมต่อ order สูงกว่าขายชิ้นเดียว`,
      bestFor: 'สินค้าใช้หมดได้, ของใช้ประจำวัน, ขายส่ง',
      highlight: false,
    },
  ]

  return suggestions
}
