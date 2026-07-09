// 状态显示映射（子状态）
const statusMap = {
    'pending_confirm': { text: '待确认', class: 'bg-yellow-100 text-yellow-800' },
    'pending_pick': { text: '待拣货', class: 'bg-yellow-100 text-yellow-700' },
    'pending_print': { text: '待打印', class: 'bg-blue-100 text-blue-800' },
    'pending_allocate': { text: '待配货', class: 'bg-purple-100 text-purple-800' },
    'pending_review': { text: '待复核', class: 'bg-orange-100 text-orange-800' },
    'shipped': { text: '已出库', class: 'bg-green-100 text-green-800' }
};

// 状态分组映射
const statusGroupMap = {
    'pending': ['pending_confirm', 'pending_pick', 'pending_print', 'pending_allocate', 'pending_review'],
    'shipped': ['shipped']
};

// 导出字段配置
const exportFieldsConfig = [
    { key: 'orderNo', label: '出库单号' },
    { key: 'customerCode', label: '客户代码' },
    { key: 'carrier', label: '承运商' },
    { key: 'platformStore', label: '平台店铺' },
    { key: 'itemCount', label: '订单内件数' },
    { key: 'productInfo', label: '产品信息' },
    { key: 'status', label: '状态' },
    { key: 'costTime', label: '费用发生时间' },
    { key: 'shippingChannel', label: '配送渠道' },
    { key: 'country', label: '国家' },
    { key: 'weight', label: '计费重' },
    { key: 'weightUnit', label: '计费单位' },
    { key: 'outboundFee', label: '出库费' },
    { key: 'basePrice', label: '运输费' },
    { key: 'residentialFee', label: '住宅附加费' },
    { key: 'oversizeFee', label: '超长费' },
    { key: 'overweightFee', label: '超重费' },
    { key: 'oversizedFee', label: '超大件费' },
    { key: 'remoteFee', label: '偏远' },
    { key: 'extraRemoteFee', label: '超偏远' },
    { key: 'fuelSurcharge', label: '燃油附加费' },
    { key: 'otherFees', label: '其他费用' },
    { key: 'totalCost', label: '总费用' }
];

// 分页状态
let currentPage = 1;
const pageSize = 10;
let currentStatusFilter = '';
let filteredData = [];

// 客户代码多选状态
let customerCodes = [];
const MAX_CUSTOMER_CODES = 500;

// 示例数据（20条）
const sampleData = [
    { id:1, orderNo:'ORD20240101001', customerCode:'CUS001', carrier:'FEDEX', platformStore:'店铺A', itemCount:3, productInfo:'蓝牙耳机 x2, 手机壳 x1', status:'pending_confirm', costTime:'2024-01-15 10:30:00', shippingChannel:'ZYBQ_FEDEX', country:'美国', weight:2.5, weightUnit:'kg', outboundFee:15.00, basePrice:20.00, residentialFee:5.00, oversizeFee:0.00, overweightFee:0.00, oversizedFee:0.00, remoteFee:0.00, extraRemoteFee:0.00, fuelSurcharge:8.50, otherFees:{total:3.50, details:[{name:'手续费', amount:2.00},{name:'包装费', amount:1.50}]}, totalCost:52.00 },
    { id:2, orderNo:'ORD20240101002', customerCode:'CUS002', carrier:'UPS', platformStore:'店铺B', itemCount:1, productInfo:'运动鞋 x1', status:'pending_pick', costTime:'2024-01-15 11:20:00', shippingChannel:'ZYBQ_UPS', country:'英国', weight:1.2, weightUnit:'kg', outboundFee:12.00, basePrice:18.00, residentialFee:3.00, oversizeFee:0.00, overweightFee:0.00, oversizedFee:0.00, remoteFee:5.00, extraRemoteFee:0.00, fuelSurcharge:6.00, otherFees:{total:0, details:[]}, totalCost:44.00 },
    { id:3, orderNo:'ORD20240101003', customerCode:'CUS001', carrier:'FEDEX', platformStore:'店铺A', itemCount:2, productInfo:'平板电脑 x1, 保护套 x1', status:'pending_print', costTime:'2024-01-15 14:45:00', shippingChannel:'ZYBQ_FEDEX', country:'加拿大', weight:3.8, weightUnit:'kg', outboundFee:18.00, basePrice:25.00, residentialFee:5.00, oversizeFee:10.00, overweightFee:0.00, oversizedFee:0.00, remoteFee:8.00, extraRemoteFee:0.00, fuelSurcharge:9.50, otherFees:{total:5.00, details:[{name:'清关费', amount:3.00},{name:'仓储费', amount:2.00}]}, totalCost:80.50 },
    { id:4, orderNo:'ORD20240101004', customerCode:'CUS003', carrier:'USPS', platformStore:'店铺C', itemCount:5, productInfo:'T恤 x3, 短裤 x2', status:'pending_allocate', costTime:'2024-01-16 09:15:00', shippingChannel:'ZYBQ_SY', country:'美国', weight:4.2, weightUnit:'kg', outboundFee:20.00, basePrice:22.00, residentialFee:5.00, oversizeFee:0.00, overweightFee:8.00, oversizedFee:0.00, remoteFee:0.00, extraRemoteFee:0.00, fuelSurcharge:7.50, otherFees:{total:0, details:[]}, totalCost:62.50 },
    { id:5, orderNo:'ORD20240101005', customerCode:'CUS001', carrier:'FEDEX', platformStore:'店铺A', itemCount:1, productInfo:'电视机 x1', status:'shipped', costTime:'2024-01-16 10:00:00', shippingChannel:'ZYBQ_FEDEX', country:'美国', weight:15.0, weightUnit:'kg', outboundFee:35.00, basePrice:45.00, residentialFee:8.00, oversizeFee:20.00, overweightFee:15.00, oversizedFee:25.00, remoteFee:0.00, extraRemoteFee:0.00, fuelSurcharge:18.00, otherFees:{total:12.00, details:[{name:'保险费', amount:8.00},{name:'处理费', amount:4.00}]}, totalCost:178.00 },
    { id:6, orderNo:'ORD20240101006', customerCode:'CUS002', carrier:'UPS', platformStore:'店铺B', itemCount:2, productInfo:'手表 x1, 表带 x1', status:'pending_review', costTime:'2024-01-16 13:30:00', shippingChannel:'ZYBQ_UPS', country:'德国', weight:0.8, weightUnit:'kg', outboundFee:10.00, basePrice:15.00, residentialFee:3.00, oversizeFee:0.00, overweightFee:0.00, oversizedFee:0.00, remoteFee:12.00, extraRemoteFee:5.00, fuelSurcharge:4.50, otherFees:{total:0, details:[]}, totalCost:49.50 },
    { id:7, orderNo:'ORD20240101007', customerCode:'CUS004', carrier:'AMAZON', platformStore:'店铺D', itemCount:4, productInfo:'键盘 x1, 鼠标 x1, 鼠标垫 x1, USB线 x1', status:'shipped', costTime:'2024-01-17 08:45:00', shippingChannel:'ZYBQ_DS', country:'美国', weight:1.5, weightUnit:'kg', outboundFee:12.00, basePrice:16.00, residentialFee:3.00, oversizeFee:0.00, overweightFee:0.00, oversizedFee:0.00, remoteFee:0.00, extraRemoteFee:0.00, fuelSurcharge:5.00, otherFees:{total:2.50, details:[{name:'标签费', amount:2.50}]}, totalCost:38.50 },
    { id:8, orderNo:'ORD20240101008', customerCode:'CUS001', carrier:'FEDEX', platformStore:'店铺A', itemCount:1, productInfo:'自行车 x1', status:'pending_confirm', costTime:'2024-01-17 09:30:00', shippingChannel:'ZYBQ_FEDEX', country:'澳大利亚', weight:12.0, weightUnit:'kg', outboundFee:30.00, basePrice:40.00, residentialFee:8.00, oversizeFee:15.00, overweightFee:10.00, oversizedFee:20.00, remoteFee:15.00, extraRemoteFee:10.00, fuelSurcharge:16.00, otherFees:{total:8.00, details:[{name:'清关费', amount:5.00},{name:'检疫费', amount:3.00}]}, totalCost:172.00 },
    { id:9, orderNo:'ORD20240101009', customerCode:'CUS005', carrier:'GOFO', platformStore:'店铺E', itemCount:3, productInfo:'水杯 x3', status:'pending_pick', costTime:'2024-01-17 11:00:00', shippingChannel:'ZYBQ_SY', country:'日本', weight:1.0, weightUnit:'kg', outboundFee:8.00, basePrice:12.00, residentialFee:2.00, oversizeFee:0.00, overweightFee:0.00, oversizedFee:0.00, remoteFee:3.00, extraRemoteFee:0.00, fuelSurcharge:3.50, otherFees:{total:0, details:[]}, totalCost:28.50 },
    { id:10, orderNo:'ORD20240101010', customerCode:'CUS003', carrier:'FEDEX', platformStore:'店铺C', itemCount:2, productInfo:'空气净化器 x1, 滤芯 x1', status:'shipped', costTime:'2024-01-17 14:20:00', shippingChannel:'ZYBQ_FEDEX', country:'美国', weight:6.5, weightUnit:'kg', outboundFee:22.00, basePrice:28.00, residentialFee:5.00, oversizeFee:0.00, overweightFee:5.00, oversizedFee:0.00, remoteFee:0.00, extraRemoteFee:0.00, fuelSurcharge:9.00, otherFees:{total:0, details:[]}, totalCost:69.00 },
    { id:11, orderNo:'ORD20240101011', customerCode:'CUS006', carrier:'LTL', platformStore:'店铺F', itemCount:1, productInfo:'沙发 x1', status:'pending_print', costTime:'2024-01-18 08:00:00', shippingChannel:'ZYBQ_DS', country:'美国', weight:35.0, weightUnit:'kg', outboundFee:50.00, basePrice:60.00, residentialFee:10.00, oversizeFee:30.00, overweightFee:25.00, oversizedFee:35.00, remoteFee:0.00, extraRemoteFee:0.00, fuelSurcharge:28.00, otherFees:{total:15.00, details:[{name:'搬运费', amount:10.00},{name:'上楼费', amount:5.00}]}, totalCost:253.00 },
    { id:12, orderNo:'ORD20240101012', customerCode:'CUS002', carrier:'UPS', platformStore:'店铺B', itemCount:1, productInfo:'连衣裙 x1', status:'pending_allocate', costTime:'2024-01-18 09:45:00', shippingChannel:'ZYBQ_UPS', country:'法国', weight:0.5, weightUnit:'kg', outboundFee:8.00, basePrice:12.00, residentialFee:2.00, oversizeFee:0.00, overweightFee:0.00, oversizedFee:0.00, remoteFee:10.00, extraRemoteFee:0.00, fuelSurcharge:4.00, otherFees:{total:0, details:[]}, totalCost:36.00 },
    { id:13, orderNo:'ORD20240101013', customerCode:'CUS007', carrier:'One-Touch', platformStore:'店铺G', itemCount:6, productInfo:'袜子 x6', status:'shipped', costTime:'2024-01-18 10:30:00', shippingChannel:'ZYBQ_SY', country:'美国', weight:0.6, weightUnit:'kg', outboundFee:6.00, basePrice:8.00, residentialFee:2.00, oversizeFee:0.00, overweightFee:0.00, oversizedFee:0.00, remoteFee:0.00, extraRemoteFee:0.00, fuelSurcharge:2.50, otherFees:{total:0, details:[]}, totalCost:18.50 },
    { id:14, orderNo:'ORD20240101014', customerCode:'CUS001', carrier:'FEDEX', platformStore:'店铺A', itemCount:2, productInfo:'相机 x1, 存储卡 x1', status:'pending_review', costTime:'2024-01-18 13:15:00', shippingChannel:'ZYBQ_FEDEX', country:'加拿大', weight:1.8, weightUnit:'kg', outboundFee:14.00, basePrice:20.00, residentialFee:4.00, oversizeFee:0.00, overweightFee:0.00, oversizedFee:0.00, remoteFee:6.00, extraRemoteFee:0.00, fuelSurcharge:6.50, otherFees:{total:4.00, details:[{name:'保险费', amount:4.00}]}, totalCost:54.50 },
    { id:15, orderNo:'ORD20240101015', customerCode:'CUS004', carrier:'USPS', platformStore:'店铺D', itemCount:3, productInfo:'书籍 x3', status:'pending_confirm', costTime:'2024-01-19 08:30:00', shippingChannel:'ZYBQ_SY', country:'美国', weight:2.0, weightUnit:'kg', outboundFee:10.00, basePrice:14.00, residentialFee:3.00, oversizeFee:0.00, overweightFee:0.00, oversizedFee:0.00, remoteFee:0.00, extraRemoteFee:0.00, fuelSurcharge:4.50, otherFees:{total:0, details:[]}, totalCost:31.50 },
    { id:16, orderNo:'ORD20240101016', customerCode:'CUS008', carrier:'AMAZON', platformStore:'店铺H', itemCount:1, productInfo:'电饭煲 x1', status:'shipped', costTime:'2024-01-19 09:00:00', shippingChannel:'ZYBQ_DS', country:'美国', weight:4.0, weightUnit:'kg', outboundFee:18.00, basePrice:24.00, residentialFee:5.00, oversizeFee:0.00, overweightFee:0.00, oversizedFee:0.00, remoteFee:0.00, extraRemoteFee:0.00, fuelSurcharge:7.50, otherFees:{total:0, details:[]}, totalCost:54.50 },
    { id:17, orderNo:'ORD20240101017', customerCode:'CUS005', carrier:'FEDEX', platformStore:'店铺E', itemCount:1, productInfo:'音箱 x1', status:'pending_pick', costTime:'2024-01-19 11:30:00', shippingChannel:'ZYBQ_FEDEX', country:'英国', weight:3.0, weightUnit:'kg', outboundFee:15.00, basePrice:20.00, residentialFee:4.00, oversizeFee:0.00, overweightFee:0.00, oversizedFee:0.00, remoteFee:8.00, extraRemoteFee:0.00, fuelSurcharge:7.00, otherFees:{total:3.00, details:[{name:'包装费', amount:3.00}]}, totalCost:57.00 },
    { id:18, orderNo:'ORD20240101018', customerCode:'CUS006', carrier:'UPS', platformStore:'店铺F', itemCount:2, productInfo:'瑜伽垫 x1, 瑜伽砖 x1', status:'pending_print', costTime:'2024-01-19 14:00:00', shippingChannel:'ZYBQ_UPS', country:'德国', weight:2.5, weightUnit:'kg', outboundFee:14.00, basePrice:18.00, residentialFee:4.00, oversizeFee:0.00, overweightFee:0.00, oversizedFee:0.00, remoteFee:10.00, extraRemoteFee:5.00, fuelSurcharge:6.50, otherFees:{total:0, details:[]}, totalCost:57.50 },
    { id:19, orderNo:'ORD20240101019', customerCode:'CUS007', carrier:'GOFO', platformStore:'店铺G', itemCount:4, productInfo:'零食礼包 x4', status:'shipped', costTime:'2024-01-20 08:15:00', shippingChannel:'ZYBQ_SY', country:'韩国', weight:3.5, weightUnit:'kg', outboundFee:16.00, basePrice:22.00, residentialFee:4.00, oversizeFee:0.00, overweightFee:0.00, oversizedFee:0.00, remoteFee:5.00, extraRemoteFee:0.00, fuelSurcharge:7.00, otherFees:{total:6.00, details:[{name:'关税', amount:4.00},{name:'检验费', amount:2.00}]}, totalCost:60.00 },
    { id:20, orderNo:'ORD20240101020', customerCode:'CUS008', carrier:'FEDEX', platformStore:'店铺H', itemCount:1, productInfo:'显示器 x1', status:'pending_allocate', costTime:'2024-01-20 10:45:00', shippingChannel:'ZYBQ_FEDEX', country:'美国', weight:8.0, weightUnit:'kg', outboundFee:25.00, basePrice:32.00, residentialFee:6.00, oversizeFee:10.00, overweightFee:0.00, oversizedFee:15.00, remoteFee:0.00, extraRemoteFee:0.00, fuelSurcharge:12.00, otherFees:{total:0, details:[]}, totalCost:100.00 }
];

// 配送渠道级联数据（模拟产品管理接口数据）
const shippingChannelData = {
    'non-discovery': {
        label: '非发现快递',
        children: [
            { value: 'ZYBQ_FEDEX', label: 'ZYBQ_FEDEX' },
            { value: 'ZYBQ_UPS', label: 'ZYBQ_UPS' },
            { value: 'ZYBQ_USPS', label: 'ZYBQ_USPS' },
            { value: 'ZYBQ_AMAZON', label: 'ZYBQ_AMAZON' },
            { value: 'ZYBQ_GOFO', label: 'ZYBQ_GOFO' },
            { value: 'ZYBQ_LTL', label: 'ZYBQ_LTL' },
            { value: 'ZYBQ_ONETOUCH', label: 'ZYBQ_ONETOUCH' }
        ]
    },
    'discovery': {
        label: '发现快递',
        children: [
            { value: 'SEMITEMU', label: 'SEMITEMU' },
            { value: 'ZYBQ', label: 'ZYBQ' },
            { value: 'ZYBQ_FEDEX', label: 'ZYBQ_FEDEX' },
            { value: 'ZYBQ_UPS', label: 'ZYBQ_UPS' },
            { value: 'ZYBQ_SY', label: 'ZYBQ_SY' },
            { value: 'ZYBQ_DS', label: 'ZYBQ_DS' }
        ]
    }
};

let selectedShippingChannel = '';

// 页面加载时初始化
document.addEventListener('DOMContentLoaded', function() {
    applyFilters();
});

// 获取筛选后的数据
function getFilteredData() {
    const warehouse = document.getElementById('filterWarehouse').value;
    const carrier = document.getElementById('filterCarrier').value;
    const shippingChannel = document.getElementById('filterShippingChannel').value;
    const dateFrom = document.getElementById('filterDateFrom').value;
    const dateTo = document.getElementById('filterDateTo').value;
    const weightFrom = document.getElementById('filterWeightFrom').value;
    const weightTo = document.getElementById('filterWeightTo').value;
    const costFrom = document.getElementById('filterCostFrom').value;
    const costTo = document.getElementById('filterCostTo').value;
    const orderNo = document.getElementById('filterOrderNo').value.trim();
    const orderNoMode = document.getElementById('filterOrderNoMode').value;

    return sampleData.filter(item => {
        // 状态分组筛选
        if (currentStatusFilter && statusGroupMap[currentStatusFilter]) {
            if (!statusGroupMap[currentStatusFilter].includes(item.status)) return false;
        }
        if (warehouse && item.warehouse !== warehouse) return false;
        if (carrier && item.carrier !== carrier) return false;
        if (shippingChannel && item.shippingChannel !== shippingChannel) return false;
        // 出库单号筛选（精确/模糊）
        if (orderNo) {
            if (orderNoMode === 'exact') {
                const orderNos = orderNo.split(/\s+/);
                if (!orderNos.includes(item.orderNo)) return false;
            } else {
                // 模糊查询：单条模糊匹配
                if (!item.orderNo.includes(orderNo)) return false;
            }
        }
        // 客户代码筛选
        if (customerCodes.length > 0) {
            if (!customerCodes.includes(item.customerCode)) return false;
        }
        if (weightFrom && item.weight < parseFloat(weightFrom)) return false;
        if (weightTo && item.weight > parseFloat(weightTo)) return false;
        if (costFrom && item.totalCost < parseFloat(costFrom)) return false;
        if (costTo && item.totalCost > parseFloat(costTo)) return false;
        return true;
    });
}

// 应用筛选并重置到第一页
function applyFilters() {
    filteredData = getFilteredData();
    currentPage = 1;
    renderPage();
    updateTotalAmount(filteredData);
}

// 渲染其他费用单元格（有值时蓝色展示，支持悬停查看明细）
function renderOtherFeesCell(otherFees) {
    if (!otherFees || otherFees.total === 0) {
        return '<td class="px-3 py-3 text-gray-600 whitespace-nowrap">0.00</td>';
    }
    const detailsHtml = otherFees.details.map(d => `<div class="other-fees-detail-item"><span>${d.name}</span><span>${d.amount.toFixed(2)} USD</span></div>`).join('');
    return `<td class="px-3 py-3 whitespace-nowrap other-fees-cell" onmouseenter="showOtherFeesTooltip(this, '${escapeHtml(detailsHtml)}')" onmouseleave="hideOtherFeesTooltip()">
        <span class="other-fees-value">${otherFees.total.toFixed(2)}</span>
    </td>`;
}

// 转义HTML
function escapeHtml(str) {
    return str.replace(/'/g, "\\'").replace(/"/g, '&quot;');
}

// 显示其他费用弹窗
function showOtherFeesTooltip(element, detailsHtml) {
    hideOtherFeesTooltip();
    const tooltip = document.createElement('div');
    tooltip.className = 'other-fees-tooltip';
    tooltip.id = 'otherFeesTooltip';
    tooltip.innerHTML = '<div class="other-fees-tooltip-title">其他费用明细</div>' + detailsHtml.replace(/\\'/g, "'");
    document.body.appendChild(tooltip);
    const rect = element.getBoundingClientRect();
    tooltip.style.left = rect.left + window.scrollX + 'px';
    tooltip.style.top = rect.bottom + window.scrollY + 5 + 'px';
}

// 隐藏其他费用弹窗
function hideOtherFeesTooltip() {
    const tooltip = document.getElementById('otherFeesTooltip');
    if (tooltip) tooltip.remove();
}

// 渲染当前页数据
function renderPage() {
    const start = (currentPage - 1) * pageSize;
    const end = start + pageSize;
    const pageData = filteredData.slice(start, end);

    const tbody = document.getElementById('tableBody');
    tbody.innerHTML = '';

    pageData.forEach((item) => {
        const status = statusMap[item.status] || { text: item.status, class: 'bg-gray-100 text-gray-800' };
        const row = document.createElement('tr');
        row.className = 'hover:bg-gray-50';
        row.innerHTML = `
            <td class="px-3 py-3 font-medium text-gray-900 whitespace-nowrap">${item.orderNo}</td>
            <td class="px-3 py-3 text-gray-600 whitespace-nowrap">${item.customerCode}</td>
            <td class="px-3 py-3 text-gray-600 whitespace-nowrap">${item.carrier}</td>
            <td class="px-3 py-3 text-gray-600 whitespace-nowrap">${item.platformStore}</td>
            <td class="px-3 py-3 text-gray-600 whitespace-nowrap">${item.itemCount}</td>
            <td class="px-3 py-3 text-gray-600 whitespace-nowrap">${item.productInfo}</td>
            <td class="px-3 py-3 whitespace-nowrap"><span class="px-2 py-1 text-xs font-medium rounded ${status.class}">${status.text}</span></td>
            <td class="px-3 py-3 text-gray-600 whitespace-nowrap">${item.costTime}</td>
            <td class="px-3 py-3 text-gray-600 whitespace-nowrap">${item.shippingChannel}</td>
            <td class="px-3 py-3 text-gray-600 whitespace-nowrap">${item.country}</td>
            <td class="px-3 py-3 text-gray-600 whitespace-nowrap">${item.weight}</td>
            <td class="px-3 py-3 text-gray-600 whitespace-nowrap">${item.weightUnit}</td>
            <td class="px-3 py-3 text-gray-600 whitespace-nowrap">${item.outboundFee.toFixed(2)}</td>
            <td class="px-3 py-3 text-gray-600 whitespace-nowrap">${item.basePrice.toFixed(2)}</td>
            <td class="px-3 py-3 text-gray-600 whitespace-nowrap">${item.residentialFee.toFixed(2)}</td>
            <td class="px-3 py-3 text-gray-600 whitespace-nowrap">${item.oversizeFee.toFixed(2)}</td>
            <td class="px-3 py-3 text-gray-600 whitespace-nowrap">${item.overweightFee.toFixed(2)}</td>
            <td class="px-3 py-3 text-gray-600 whitespace-nowrap">${item.oversizedFee.toFixed(2)}</td>
            <td class="px-3 py-3 text-gray-600 whitespace-nowrap">${item.remoteFee.toFixed(2)}</td>
            <td class="px-3 py-3 text-gray-600 whitespace-nowrap">${item.extraRemoteFee.toFixed(2)}</td>
            <td class="px-3 py-3 text-gray-600 whitespace-nowrap">${item.fuelSurcharge.toFixed(2)}</td>
            ${renderOtherFeesCell(item.otherFees)}
            <td class="px-3 py-3 font-bold text-danger whitespace-nowrap">${item.totalCost.toFixed(2)}</td>
        `;
        tbody.appendChild(row);
    });

    document.getElementById('totalCount').textContent = filteredData.length;
    renderPagination();
}

// 渲染分页
function renderPagination() {
    const totalPages = Math.ceil(filteredData.length / pageSize) || 1;
    const pagination = document.getElementById('pagination');
    pagination.innerHTML = '';

    // 上一页
    const prevBtn = document.createElement('button');
    prevBtn.className = 'pagination-btn' + (currentPage === 1 ? ' disabled' : '');
    prevBtn.textContent = '上一页';
    prevBtn.disabled = currentPage === 1;
    prevBtn.onclick = function() { if (currentPage > 1) { currentPage--; renderPage(); } };
    pagination.appendChild(prevBtn);

    // 页码
    for (let i = 1; i <= totalPages; i++) {
        const btn = document.createElement('button');
        btn.className = 'pagination-btn' + (i === currentPage ? ' active' : '');
        btn.textContent = i;
        btn.onclick = function() { currentPage = i; renderPage(); };
        pagination.appendChild(btn);
    }

    // 下一页
    const nextBtn = document.createElement('button');
    nextBtn.className = 'pagination-btn' + (currentPage === totalPages ? ' disabled' : '');
    nextBtn.textContent = '下一页';
    nextBtn.disabled = currentPage === totalPages;
    nextBtn.onclick = function() { if (currentPage < totalPages) { currentPage++; renderPage(); } };
    pagination.appendChild(nextBtn);
}

// 更新总金额
function updateTotalAmount(data) {
    const total = data.reduce((sum, item) => sum + item.totalCost, 0);
    document.getElementById('totalAmount').textContent = total.toLocaleString('zh-CN', { minimumFractionDigits: 2 }) + ' USD';
}

// 状态码标签切换
function handleStatusTab(el) {
    document.querySelectorAll('.status-tab').forEach(t => t.classList.remove('active'));
    el.classList.add('active');
    currentStatusFilter = el.getAttribute('data-status');
    applyFilters();
}

// 查询
function handleSearch() {
    applyFilters();
}

// 重置
function handleReset() {
    document.getElementById('filterWarehouse').value = '';
    document.getElementById('filterCarrier').value = '';
    document.getElementById('filterShippingChannel').value = '';
    document.getElementById('filterDateFrom').value = '';
    document.getElementById('filterDateTo').value = '';
    document.getElementById('filterWeightFrom').value = '';
    document.getElementById('filterWeightTo').value = '';
    document.getElementById('filterCostFrom').value = '';
    document.getElementById('filterCostTo').value = '';
    document.getElementById('filterOrderNo').value = '';
    document.getElementById('filterOrderNoMode').value = 'exact';
    updateOrderNoPlaceholder();

    // 重置客户代码
    customerCodes = [];
    renderCustomerCodeTags();
    updateCustomerCodePlaceholder();

    // 重置配送渠道
    selectedShippingChannel = '';
    document.getElementById('shippingChannelPlaceholder').textContent = '请选择';
    document.getElementById('shippingChannelPlaceholder').className = 'cascading-select-placeholder';

    currentStatusFilter = '';
    document.querySelectorAll('.status-tab').forEach(t => t.classList.remove('active'));
    document.querySelector('.status-tab[data-status=""]').classList.add('active');

    applyFilters();
}

// 出库单号placeholder更新
function updateOrderNoPlaceholder() {
    const mode = document.getElementById('filterOrderNoMode').value;
    const input = document.getElementById('filterOrderNo');
    if (mode === 'exact') {
        input.placeholder = '支持多个精确匹配，中间以空格隔开';
    } else {
        input.placeholder = '输入单号进行模糊查询';
    }
}

// ========== 客户代码多选逻辑 ==========

function toggleCustomerCodeDropdown() {
    const dropdown = document.getElementById('customerCodeDropdown');
    dropdown.classList.toggle('show');
    if (dropdown.classList.contains('show')) {
        document.getElementById('customerCodeInput').focus();
    }
}

function handleCustomerCodeInput(input) {
    // 实时显示输入内容
}

function handleCustomerCodeKeydown(event) {
    if (event.key === 'Enter' || event.key === ',' || event.key === '，') {
        event.preventDefault();
        const value = event.target.value.trim().replace(/[,，]/g, '');
        if (value && customerCodes.length < MAX_CUSTOMER_CODES && !customerCodes.includes(value)) {
            customerCodes.push(value);
            renderCustomerCodeTags();
            updateCustomerCodePlaceholder();
            event.target.value = '';
            updateCustomerCodeHint();
        }
    }
    if (event.key === 'Backspace' && event.target.value === '' && customerCodes.length > 0) {
        customerCodes.pop();
        renderCustomerCodeTags();
        updateCustomerCodePlaceholder();
        updateCustomerCodeHint();
    }
}

function removeCustomerCode(code) {
    const index = customerCodes.indexOf(code);
    if (index > -1) {
        customerCodes.splice(index, 1);
        renderCustomerCodeTags();
        updateCustomerCodePlaceholder();
        updateCustomerCodeHint();
    }
}

function renderCustomerCodeTags() {
    const tagsContainer = document.getElementById('customerCodeTags');
    tagsContainer.innerHTML = '';
    customerCodes.forEach(code => {
        const tag = document.createElement('span');
        tag.className = 'multi-select-tag';
        tag.innerHTML = `${code} <i class="fa fa-times" onclick="removeCustomerCode('${code}')"></i>`;
        tagsContainer.appendChild(tag);
    });
}

function updateCustomerCodePlaceholder() {
    const placeholder = document.getElementById('customerCodePlaceholder');
    if (customerCodes.length > 0) {
        placeholder.textContent = customerCodes.join(', ');
        placeholder.className = 'multi-select-text';
    } else {
        placeholder.textContent = '请输入，最多500条';
        placeholder.className = 'multi-select-placeholder';
    }
}

function updateCustomerCodeHint() {
    document.getElementById('customerCodeHint').textContent = customerCodes.length + '/' + MAX_CUSTOMER_CODES;
}

function confirmCustomerCode() {
    // 处理输入框中剩余的内容
    const input = document.getElementById('customerCodeInput');
    const value = input.value.trim().replace(/[,，]/g, '');
    if (value && customerCodes.length < MAX_CUSTOMER_CODES && !customerCodes.includes(value)) {
        customerCodes.push(value);
        renderCustomerCodeTags();
        updateCustomerCodePlaceholder();
        input.value = '';
    }
    document.getElementById('customerCodeDropdown').classList.remove('show');
    applyFilters();
}

function cancelCustomerCode() {
    document.getElementById('customerCodeInput').value = '';
    document.getElementById('customerCodeDropdown').classList.remove('show');
}

// ========== 配送渠道级联下拉逻辑 ==========

function toggleShippingChannelDropdown() {
    const dropdown = document.getElementById('shippingChannelDropdown');
    dropdown.classList.toggle('show');
    if (dropdown.classList.contains('show')) {
        backToShippingLevel1();
    }
}

function toggleShippingLevel2(level) {
    const level1 = document.querySelector('.cascading-select-level1');
    const level2 = document.getElementById('shippingLevel2Container');
    const options = document.getElementById('shippingLevel2Options');
    const title = document.getElementById('shippingLevel2Title');

    const data = shippingChannelData[level];
    title.textContent = data.label;

    options.innerHTML = '';
    data.children.forEach(child => {
        const item = document.createElement('div');
        item.className = 'cascading-select-option';
        if (selectedShippingChannel === child.value) {
            item.classList.add('selected');
        }
        item.innerHTML = `<span>${child.label}</span>`;
        item.onclick = function() { selectShippingChannel(child.value, child.label); };
        options.appendChild(item);
    });

    level1.style.display = 'none';
    level2.style.display = 'block';
}

function backToShippingLevel1() {
    const level1 = document.querySelector('.cascading-select-level1');
    const level2 = document.getElementById('shippingLevel2Container');
    level1.style.display = 'block';
    level2.style.display = 'none';
}

function selectShippingChannel(value, label) {
    selectedShippingChannel = value;
    document.getElementById('filterShippingChannel').value = value;

    const placeholder = document.getElementById('shippingChannelPlaceholder');
    placeholder.textContent = label;
    placeholder.className = 'cascading-select-text';

    // 更新二级选项的选中状态
    const options = document.querySelectorAll('.cascading-select-option');
    options.forEach(opt => {
        opt.classList.remove('selected');
        if (opt.querySelector('span').textContent === label) {
            opt.classList.add('selected');
        }
    });
}

function confirmShippingChannel() {
    document.getElementById('shippingChannelDropdown').classList.remove('show');
    applyFilters();
}

function cancelShippingChannel() {
    document.getElementById('shippingChannelDropdown').classList.remove('show');
}

// 点击外部关闭配送渠道下拉框
document.addEventListener('click', function(event) {
    const wrapper = document.getElementById('shippingChannelWrapper');
    if (wrapper && !wrapper.contains(event.target)) {
        const dropdown = document.getElementById('shippingChannelDropdown');
        if (dropdown) dropdown.classList.remove('show');
    }
});

// 点击外部关闭下拉框
document.addEventListener('click', function(event) {
    const wrapper = document.getElementById('customerCodeWrapper');
    if (wrapper && !wrapper.contains(event.target)) {
        const dropdown = document.getElementById('customerCodeDropdown');
        if (dropdown) dropdown.classList.remove('show');
    }
});

// ========== 导出逻辑 ==========

// 打开导出弹窗
function openExportModal() {
    generateExportFields();
    document.getElementById('exportModal').style.display = 'flex';
}

// 关闭导出弹窗
function closeExportModal(event) {
    if (!event || event.target === document.getElementById('exportModal')) {
        document.getElementById('exportModal').style.display = 'none';
    }
}

// 生成导出字段勾选列表
function generateExportFields() {
    const grid = document.getElementById('exportFieldsGrid');
    grid.innerHTML = '';
    exportFieldsConfig.forEach((field) => {
        const label = document.createElement('label');
        label.className = 'export-field-item';
        label.innerHTML = `
            <input type="checkbox" class="export-field-checkbox" value="${field.key}" checked onchange="updateExportSelectedCount()">
            <span>${field.label}</span>
        `;
        grid.appendChild(label);
    });
    updateExportSelectedCount();
}

// 更新导出已选字段计数
function updateExportSelectedCount() {
    const checkboxes = document.querySelectorAll('.export-field-checkbox');
    const checked = document.querySelectorAll('.export-field-checkbox:checked');
    document.getElementById('exportSelectedCount').textContent = checked.length;
    document.getElementById('exportSelectAll').checked = checked.length === checkboxes.length;
}

// 导出全选/取消全选
function handleExportSelectAll(el) {
    const checkboxes = document.querySelectorAll('.export-field-checkbox');
    checkboxes.forEach(cb => cb.checked = el.checked);
    updateExportSelectedCount();
}

// 导出提交 - 根据搜索条件结果导出
function handleExportSubmit() {
    const checked = document.querySelectorAll('.export-field-checkbox:checked');
    const fields = Array.from(checked).map(cb => {
        const config = exportFieldsConfig.find(f => f.key === cb.value);
        return config ? config.label : cb.value;
    });
    if (fields.length === 0) {
        alert('请至少选择一个导出字段');
        return;
    }
    alert('导出字段：' + fields.join('、') + '\n共 ' + filteredData.length + ' 条数据（根据当前搜索条件）');
    document.getElementById('exportModal').style.display = 'none';
}

// Tab 切换
function switchMainTab(tab) {
    document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
    document.getElementById('tab-' + tab).classList.add('active');

    document.querySelectorAll('.main-content').forEach(m => {
        m.style.display = 'none';
        m.classList.remove('active');
    });

    const mainContent = document.getElementById('main-' + tab);
    if (mainContent) {
        mainContent.style.display = 'block';
        mainContent.classList.add('active');
    }
}

// 逻辑说明折叠
function togglePrdLogic(id) {
    const content = document.getElementById(id + '-logic-content');
    const icon = document.getElementById(id + '-logic-icon');

    if (content.classList.contains('hidden')) {
        content.classList.remove('hidden');
        icon.style.transform = 'rotate(180deg)';
    } else {
        content.classList.add('hidden');
        icon.style.transform = 'rotate(0deg)';
    }
}

// Mermaid 模态框
function openMermaidModal(element) {
    const modal = document.getElementById('mermaidModal');
    const content = document.getElementById('mermaidModalContent');
    const mermaidCode = element.querySelector('.mermaid').textContent;

    content.innerHTML = '<div class="mermaid">' + mermaidCode + '</div>';
    modal.style.display = 'flex';

    mermaid.init(undefined, content.querySelectorAll('.mermaid'));
}

function closeMermaidModal(event) {
    if (!event || event.target === document.getElementById('mermaidModal')) {
        document.getElementById('mermaidModal').style.display = 'none';
    }
}
