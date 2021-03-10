const FileOssUrl = "https://testms.jiqiao.tech/FileDown/DownFileOSSByType?guid="
const ImgUrl = "https://ms.jiqiao.tech/FileDown/GetSharedImageQJZ?image_code="
const Url = "https://testms.jiqiao.tech"
//const Url="http://192.168.1.215:6102"
const Url2 = "http://localhost:5702/api"

module.exports = {
    rootUrl: Url,
    FileOssUrl: FileOssUrl,
    ImgUrl: ImgUrl,
    TokenUrl: Url + "/QHCommonToken/GetQHCommonTokenListV3JQ?appid=qhminiapiJQ&md5key=", //获取Access_token的地址
    UserUrl: Url + "/MiniProgram/CheckWeChatCode", //验证用户是否存在记录
    RegisterUrl: Url + "/MiniProgram/Register", //注册手机号
    VerificationCodeUrl: Url + "/MiniProgram/VerificationCode", //获取验证码 
    QueryCurrStageUrl: Url + "/Received/QueryCurrStage", //获取当前流程点ID和流程点名称
    QueryReceivedListUrl: Url + "/Received/QueryReceivedList", //获取收件  
    QuerySheetMakerDataUrl: Url + "/Received/QuerySheetMakerData", //获取做账 
    QueryDeclarerDataUrl: Url + "/Received/QueryDeclarerData", //获取申报   
    QueryCustomerListUrl: Url + "/MiniProgram/QueryCustomerList", //我的公司---获取用户对应的公司信息列表
    QueryCustomerServiceUrl: Url + "/MiniProgram/QueryCustomerService", //我的合同---获取合同
    QueryBalanceSheetUrl: Url + "/Account/QueryBalanceSheet", //获取资产负债表
    QueryBalanceSheetDetailUrl: Url + "/Account/QueryBalanceSheetDetail", //获取资产负债表明细
    QueryIncomeSheetUrl: Url + "/Account/QueryIncomeSheet", //获取利润表
    QueryIncomeSheetDetailUrl: Url + "/Account/QueryIncomeSheetDetail", //获取利润表明细   
    QueryCashFlowsStatementUrl: Url + "/Account/QueryCashFlowsStatement", //获取现金流量表
    QueryAccountReceivableUrl: Url + "/Account/QueryAccountReceivable", //获取应收账款
    QueryAccountPayableUrl: Url + "/Account/QueryAccountPayable", //获取应付账款  
    QueryAccountReceivableOtherUrl: Url + "/Account/QueryAccountReceivableOther", //获取其他应收账款
    QueryAccountPayableOtherUrl: Url + "/Account/QueryAccountPayableOther", //获取其他应付账款
    QueryImInvoiceStatDataUrl: Url + "/Invoice/QueryImInvoiceStatData", //获取开票统计信息 
    QueryOmInvoiceDataUrl: Url + "/Invoice/QueryOmInvoiceData", //获取进项发票信息
    QueryImInvoiceDataUrl: Url + "/Invoice/QueryImInvoiceData", //获取销项发票信息
    QueryTotalIncomeAndIsUrl: Url + "/Account/QueryTotalIncomeAndIs", //获取本年累计收入和利润
    QueryIncomeAndIsByMonthUrl: Url + "/Account/QueryIncomeAndIsByMonth", //获取每月收入和利润
    QueryCustomerContactInfoUrl: Url + "/MiniProgram/QueryCustomerContactInfo", //获取客户联系人信息
    QueryDeclarerIndividualTaxListUrl: Url + "/Received/QueryDeclarerIndividualTaxList", //获取个人户的生产经营个税的明细信息
    QueryPaymentReceivableDetailUrl: Url + "/Account/QueryPaymentReceivableDetail", //获取应付/应收、其他应收、其他应付的明细信息
    QueryAdvanceAccountReceivableUrl: Url + "/Account/QueryAdvanceAccountReceivable", //获取预收账款
    QueryAdvanceAccountPayableUrl: Url + "/Account/QueryAdvanceAccountPayable", //获取预付账款
    QueryAccountingAnalysisUrl: Url + "/Account/QueryAccountingAnalysis", //财务分析
    QueryBankCashDetailUrl: Url + "/Account/QueryBankCashDetail", //获取货币现金的明细信息
    QueryCustomerPaymentListUrl: Url + "/MiniProgram/QueryCustomerPaymentList", //获取待付款的合约信息
    QueryCustomerPaymentListDetailUrl: Url + "/MiniProgram/QueryCustomerPaymentListDetail", //获取待付款的合约信息的明细项
    QuerySumCustomerPaymentListUrl: Url + "/MiniProgram/QuerySumCustomerPaymentList", //获取待付款的合约汇总信息
    QueryImInvoiceStockUrl: Url + "/Invoice/QueryImInvoiceStock", //查询发票库存信息
    QueryImInvoiceStockInventoryUrl: Url + "/Invoice/QueryImInvoiceStockInventory", //查询发票库存明细清册信息
    QueryImInvoiceApprovedTypeUrl: Url + "/Invoice/QueryImInvoiceApprovedType", //查询客户的核定税种的类型
    CalculateTaxUrl: Url + "/Invoice/CalculateTax", //税金计算器
    QueryUserCustomerListUrl: Url + "/MiniProgram/QueryUserCustomerList", //查询绑定的客户信息列表
    QuerySendMailUrl: Url + "/Account/QuerySendMail", //一键发送三大报表
    WXPayGetOpenid: Url + "/WxPay/GetOpenid",
    WXPayOrderPrepaid: Url + "/WxPay/OrderPrepaid",
    QueryAssetMonthlyDepreciationUrl: Url + "/AssetAccount/QueryAssetMonthlyDepreciation", //获取固定资产折旧
    QueryAssetMonthlyDepreciationTotalUrl: Url + "/AssetAccount/QueryAssetMonthlyDepreciationTotal", //折旧汇总

    QueryOfficialAccountUrl: Url + "/MiniProgram/QueryOfficialAccountUrl", //公众号关注连接
    QueryPreProductListUrl: Url + "/ProductAccount/QueryPreProductList", //获取产品列表
    QueryPreProductListByLevelUrl: Url + "/ProductAccount/QueryPreProductListByLevel", //获取产品列表
    QueryPreProductCategoryUrl: Url + "/ProductAccount/QueryPreProductCategory", //获取产品列表分类
    QueryPreProductListByIDUrl: Url + "/ProductAccount/QueryPreProductListByID", //获取产品详情
    QuerySpreadFocusUrl: Url + "/ProductAccount/QuerySpreadFocus", //获取轮播图
    GeneratePreOrderUrl: Url + "/ProductAccount/GeneratePreOrder", //生成前置订单
    CheckCustomerNameUrl: Url + "/ProductAccount/CheckCustomerName", //提交订单检查
    CheckCellPhoneUrl: Url + "/ProductAccount/CheckCellPhone", //检查手机号是否注册
    QueryPreProductParamsUrl: Url + "/ProductAccount/QueryPreProductParams", //获取前置产品参数
    QueryPreProductPriceUrl: Url + "/ProductAccount/QueryPreProductPrice", //获取前置产品价格
    QueryPromotionCouponUseUrl: Url + "/ProductAccount/QueryPromotionCouponUse", //促销优惠券使用
    QueryMyOrderUrl: Url + "/ProductAccount/QueryMyOrder", //我的订单
    DeletePreOrderUrl: Url + "/Product/DeletePreOrder", //删除未付款前置订单
    WxPayOrderPrepaidUrl: Url + '/PayAPIJQ/OrderPrepaidMiniP', //微信支付
    PostOrderAffirmPay: Url + '/ProductAccount/PostOrderAffirmPay', //账户支付

    QueryCustAccountInfo: Url + '/CustomerPayAccount/QueryCustAccountInfo', //充值账户
    QueryCustDepositProd: Url + '/CustomerPayAccount/QueryCustDepositProd', //充值产品
    GetPayId: Url + '/CustomerPayAccount/GetPayId', //充值
    QueryCustAccountTrans: Url + '/CustomerPayAccount/QueryCustAccountTrans', //充值消费记录
    QueryCustServiceUrl: Url + "/MiniProgram/QueryServiceUser", //客服服务人员
    QueryCustServiceMessage: Url + "/MiniProgram/PullMessageListDetailByCustomer", //客服微信客服消息

    PostBusinesslicense: Url + '/IdentitfyAccount/PostBusinesslicense', //营业执照上传认证
    QueryIdentifyResults: Url + '/CustomerAccount/IdentifyResults', //获取识别结果
    VerifyConsistentUrl: Url + '/CustomerAccount/VerifyConsistent', //验证法人代表人和公司
    PostVerifyUserCodeUrl: Url + '/CustomerAccount/PostVerifyUserCode', //获取申请授权验证码
    PostVerifyEmpUrl: Url + '/CustomerAccount/PostVerifyEmp', //员工申请授权
    QueryVerifyCustListUrl: Url + '/CustomerAccount/GetdataListUser', //获取个人授权公司列表(个人信息)
    QueryVerifyEmp: Url + '/CustomerAccount/GetdataListUserInfo', //获取员工授权公司列表(授权申请)
    QueryVerifyInfo: Url + '/CustomerAccount/VerifyInfo', //获取授权公司列表(公司认证)
    QueryCustomerContactList: Url + '/CustomerAccount/CustomerContactList', //获取公司授权用户列表(公司信息)
    PostCancelAuthorization: Url + '/CustomerAccount/CancelAuthorization', //取消用户的授权
    PostDeleteVerify: Url + '/CustomerAccount/DeleteVerify', //删除公司认证信息
    FaceVerify: Url + '/MiniProgram/FaceVerify', //百度AI在线活体检测+身份验证
    PostUpdateVerifyId: Url + '/CustomerAccount/UpdateVerifyId', //开始认证检查
    PostVerityIdTypeFile: Url + '/CustomerAccount/PostVerityIdTypeFile', //上传证件文件
    PostSubmitAuditW: Url + '/CustomerAccount/PostSubmitAuditW', //提交审核

    QueryOnlinePublic: Url + '/CustomerAccount/QueryOnlinePublic', //查询年度网上公示
    PostOPUploadFile: Url + '/CustomerAccount/PostOPUploadFile', //上传年度公示文件
    PostOnlinePublic: Url + '/CustomerAccount/PostOnlinePublic', //确认年度网上公示

    QueryMyContract: Url + '/SearchAccount/PostGetContract', //获取我的合约
    PostContractFile: Url + '/IdentitfyAccount/PostContractFile', //合约文件
    PostContractFlowFile: Url + '/IdentitfyAccount/PostContractFlowFile', //合约文件
    PostSignContractUrl: Url + '/IdentitfyAccount/PostSignContractUrl', //合约签约
    QueryMyCouponUrl: Url + '/ProductAccount/QueryMyCoupon', //我的礼券
    PostBindCouponUrl: Url + '/ProductAccount/PostBindCoupon', //优惠券绑定

    PostVerifyUser: Url + '/CustomerAccount/PostVerifyUser', //个人信息认证(获取验证码)
    SaveVerifyCode: Url + '/CustomerAccount/SaveVerifyCode', //个人信息认证(确认认证)
    QueryUserInfo: Url + '/CustomerAccount/GetUserInfo', //个人信息
    QueryMessageSource: Url + '/HomeAccount/PostQueryMessageSource', //消息分类
    RefreshMessage: Url + '/HomeAccount/RefreshMessage', //获取消息
    ReadMessageById: Url + '/HomeAccount/PostReadMessageById', //阅读消息
    QueryMessageCount: Url + '/HomeAccount/GetMessageCount', //获取消息个数
    QueryNewMessage: Url + '/HomeAccount/QueryNewMessage', //获取消息列表
    QueryTaxPayableUrl: Url + "/HomeAccount/QueryTaxPayable", //获取应缴税款
    BillApi: {
        QueryMonthlySalary: Url + '/SalaryAccount/QueryMonthlySalary', //月薪资数据查询
        GetEmpInfo: Url + '/SalaryAccount/GetEmpInfo', //获取员工下拉框信息
        GetDdlList: Url + '/SalaryAccount/GetDdlList', //薪资维护下拉框列表
        PostSalary: Url + '/SalaryAccount/PostSalary', //保存薪资
        PostCopySalary: Url + '/SalaryAccount/PostCopySalary', //复制上月薪资
        PostGenerateSalary: Url + '/SalaryAccount/PostGenerateSalary', //生产薪资数据
        SalaryUploadFile: Url + '/SalaryAccount/SalaryUploadFile', //薪资文件上传
        PostHrEmployeeSalary: Url + '/SalaryAccount/PostHrEmployeeSalary', //薪资上传
        PostDeleteSalary: Url + '/SalaryAccount/PostDeleteSalary', //删除员工薪资

        GetEmpNO: Url + '/SalaryAccount/GetEmpNO', //获取员工工号
        GetCondition: Url + '/SalaryAccount/GetCondition', //获取下拉框列表
        QueryEmployee: Url + '/SalaryAccount/QueryEmployee', //获取员工列表
        PostEmployee: Url + '/SalaryAccount/PostEmployee', //保存员工资料
        PostDeleteEmployee: Url + '/SalaryAccount/PostDeleteEmployee', //删除员工资料

        PostSocialInsuranceOCR: Url + '/SalaryAccount/PostSocialInsuranceOCR', //上传社保
        PostSocialInsurancePDF: Url + '/SalaryAccount/PostSocialInsurancePDF', //上传社保缴费证明PDF
        PostHousingFundOCR: Url + '/SalaryAccount/PostHousingFundOCR', //上传公积金
        PostDeleteSocial: Url + '/SalaryAccount/PostDeleteSocial', //删除社保公积金
        PostUpdateSocial: Url + '/SalaryAccount/UpdateSocial', //修改社保公积金
        QuerySocial: Url + '/SalaryAccount/QuerySocial', //查询社保公积金

        PostInvociceImport: Url + '/IdentitfyAccount/PostInvociceImport', //进行认证文件上传
        PostWithReceipts: Url + '/SearchAccount/PostWithReceipts', //进行认证数据查询
        PostDeleteReceipts: Url + '/SearchAccount/PostDeleteReceipts', //进行认证数据删除
        PostInvVerifyCustConfirm: Url + '/SearchAccount/PostInvVerifyCustConfirm', //进行认证发票确认

        QueryExpendSearch: Url + '/SearchAccount/PostExpendSearch', //获取支出费用类型
        QueryExpendSum: Url + '/SearchAccount/PostGetSum', //获取支出费用上传识别数量
        QueryExpendEmp: Url + '/SearchAccount/PostHrEmployee', //获取支出费用人员下拉框
        PostRecognition: Url + '/IdentitfyAccount/PostRecognition', //支出费用票据识别
        QueryExpendFileDetail: Url + '/SearchAccount/PostWithFileDetail', //支出费用票据明细
        PostExpendFileDelete: Url + '/SearchAccount/PostDeleteFile', //支出费用票据删除

        QueryBankInfo: Url + '/SearchAccount/PostWithBankInfo', //获取银行信息
        QueryBankTransData: Url + '/SearchAccount/PostGetTransData', //获取银行上传数据
        PostBankImport: Url + '/IdentitfyAccount/PostIBank', //银行回单上传
        QueryBankSumAmount: Url + '/SearchAccount/PostBankZe', //获取银行汇总金额
        PostBankFileDelete: Url + '/SearchAccount/PostDeleteBnaktransdata', //银行回单删除
        PostBankStatementDel: Url + '/SearchAccount/DeleteBankLs', //银行流水数据删除


        QueryInvoiceCount: Url + '/SearchAccount/PostWithIncomCount', //获取发票汇总数
        PostInvoiceUpload: Url + '/IdentitfyAccount/PostRecognition', //发票上传
        PostInvoiceExcelUpload: Url + '/IdentitfyAccount/PostExcelIdeny', //发票汇总上传
        PostInvoiceDelete: Url + '/SearchAccount/PostDeleteFile', //删除发票明细
        QueryInvoiceDetail: Url + '/SearchAccount/PostGetIncome', //获取发票明细
        QueryInvoiceDetailHZ: Url + '/SearchAccount/PostGetIncomeHZ', //获取发票汇总明细
        PostInvoiceDeleteHz: Url + '/SearchAccount/DeleteIncomHz', //删除发票汇总表明细

        QueryMonthlyTaxReport: Url + '/TaxAccount/QueryMonthlyTaxReport', //税金计提表
        PostWithTaxFile: Url + '/SearchAccount/PostWithTaxFile', //税金计提表
        QueryBalanceSheet: Url + '/ReportAccount/QueryBalanceSheet', //获取余额表
        ExcelBalanceSheetReport: Url + '/ReportAccount/DownExcelbalancesheet', //下载余额表
        QueryStatus: Url + '/HomeAccount/QueryStatus', //查询进度状态
        QueryMonthlyDashBoard: Url + '/TaxAccount/QueryMonthlyDashBoard', //看板数据
        PsotRefhz: Url + '/SearchAccount/PsotRefhz', //刷新重新生成数据
        PostAffirm: Url + '/SearchAccount/PostAffirm', //汇总确认           
        PostAffirmTaxPay: Url + '/SearchAccount/PostAffirmTaxPay', //缴款确认
        QueryTaxPayable: Url + '/HomeAccount/QueryTaxPayable', //税款信息查询
        PostPayTrans: Url + '/SearchAccount/PostPayTrans', //生成付款信息
        PostAffirmPay: Url + '/SearchAccount/PostAffirmPay', //确认付款
        PostAffirmAgain: Url + '/SearchAccount/PostAffirmAgain', //汇总确认(退回)

        QueryEmMonthlyAmortization: Url + '/AssetAccount/QueryEmMonthlyAmortization', //长期待摊

        //-start开票申请
        GetIsInvoiceService: Url + '/HomeAccount/GetIsInvoiceService', //开票服务
        QueryInvoiceCust: Url + '/CustomerAccount/QueryCustCustomer', //获取发票客户
        PostInvoiceCust: Url + '/CustomerAccount/PostCust', //保存发票客户
        DeleteInvoiceCust: Url + '/CustomerAccount/DeleteCustCustomer', //删除发票客户
        GetConditionByInvoice: Url + '/CustomerAccount/GetCondition', //获取下拉框数据
        GetInvoiceType: Url + '/CustomerAccount/GetInvoiceType', //获取发票类型
        QueryCustInfoice: Url + '/CustomerAccount/GetCustInfoice', //获取客户的税率
        PostVendorCustomer: Url + '/CustomerAccount/GetVendorCustomer', //生成销方信息
        QueryCustVendorList: Url + '/CustomerAccount/GetCustVendorList', //获取销方信息
        PostCustVendorCustomer: Url + '/CustomerAccount/PostCustVendorCustomer', //保存销方信息
        QueryCustomerinfo: Url + '/CustomerAccount/GetCustomerinfo', //获取当前客户信息
        GetCustExpressListType: Url + '/CustomerAccount/GetCustExpressListType', //获取取票方式
        QueryCustExpress: Url + '/CustomerAccount/GetCustExpress', //获取快递地址
        PostExpress: Url + '/CustomerAccount/PostExpress', //保存快递地址
        DelExpress: Url + '/CustomerAccount/DeleteExpressID', //删除快递地址
        GetCustExpressAllList: Url + '/CustomerAccount/GetCustExpressAllList', //获取所有快递地址        
        PostInvoiceApply: Url + '/CustomerAccount/PostInvoiceApply', //提交开票申请
        QueryInvoiceApplyList: Url + '/CustomerAccount/GetInvoiceApplyList', //获取开票申请列表
        DeleteApply: Url + '/CustomerAccount/DeleteApply', //删除开票申请
        QueryCustReqMaterInfo: Url + '/CustomerAccount/GetCustReqMaterInfo', //获取开票信息
        QueryCustCustomerList: Url + '/CustomerAccount/GetCustCustomerList', //获取开票客户信息
        GetOpeninviceCategory: Url + '/CustomerAccount/GetOpeninviceCategory', //获取开票否是按次付费
        PostInvoiceSbmit: Url + '/CustomerAccount/PostInvoiceSbmit', //开票确认付款
        PostInvoiceSbmitNoPay: Url + '/CustomerAccount/PostInvoiceSbmitNoPay', //开票提交确认
        GetCmCouponCount: Url + '/CustomerAccount/GetCmCouponCount', //优惠券
        QueryPromotionCouponUseCommonUrl: Url + '/ProductAccount/QueryPromotionCouponUseCommon', //优惠券
        PostInvoiceGetPayID: Url + '/CustomerAccount/GetPayID', //在线支付
        QueryCmAgentPay: Url + '/CustomerAccount/CheckCustomerConfig', //代理支付账户
        QueryImCustReqScrap: Url + '/CustomerAccount/QueryImCustReqScrap', //发票作废申请列表
        PostImCustReqScrap: Url + '/CustomerAccount/PostImCustReqScrap', //发票作废申请
        PostImCustReqScrapCancel: Url + '/CustomerAccount/PostImCustReqScrapCancel', //发票作废申请取消
        //-end开票申请

        QueryVoucherReportUrl: Url + "/TaxAccount/QueryVoucherReport", //年度凭证
        DownPDFYearAccountReportUrl: Url + "/CustomerAccount/DownPDFYearAccountReport", //下载年度账册
        QueryDownloadLogUrl: Url + "/ReportAccount/QueryDownloadLog", //年度账册列表
        UploadPDFUrl: Url + "/CustomerAccount/UploadDPF", //年度账册生成下载记录
        QueryVoucherImageGuidUrl: Url + "/TaxAccount/QueryVoucherImageGuid", //年度图片
        DownPDFVoucherReportUrl: Url + "/TaxAccount/DownPDFVoucherReport", //年度账册

        //-start客户发票申请
        QueryCustomerInfoJQUrl: Url + "/CustomerAccount/GetCustomerInfoJQ", //获取机巧客户信息及开票类型
        QueryInvoiceApplyTaxListUrl: Url + "/CustomerAccount/GetInvoiceApplyTaxList", //获取机巧客户开票税率
        QueryRemainedInvoiceAmtUrl: Url + "/CustomerAccount/GetRemainedInvoiceAmt", //获取客户可开票金额
        QueryInvoiceItemUrl: Url + "/CustomerAccount/GetInvoiceItem", //获取开票服务项目
        QueryCustInvoiceApplyListAllUrl: Url + "/CustomerAccount/GetCustInvoiceApplyListAll", //获取客户发票申请列表
        QueryCustomerInvoiceApplyByIDUrl: Url + "/CustomerAccount/GetCustomerInvoiceApplyByID", //获取单笔发票身亲申请记录
        PostCustInvoiceApplyAddUrl: Url + "/CustomerAccount/PostCustInvoiceApplyAdd", //新增发票申请
        DeleteInvoiceApplyByID: Url + "/CustomerAccount/DeleteInvoiceApplyByID", //发票申请删除
        PostSubmitApplyS: Url + "/CustomerAccount/PostSubmitApplyS", //发票申请删除
        PostInvoiceScarpSUrl: Url + "/CustomerAccount/PostInvoiceScarpS", //发票作废提交
        PostCustInvoiceApplyScarpUrl: Url + "/CustomerAccount/PostCustInvoiceApplyScarp", //发票作废申请
        //-end客户发票申请
    },
}