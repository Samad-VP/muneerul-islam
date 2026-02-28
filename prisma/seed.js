"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var client_1 = require("@prisma/client");
var bcryptjs_1 = require("bcryptjs");
var prisma = new client_1.PrismaClient();
function main() {
    return __awaiter(this, void 0, void 0, function () {
        var hashedPassword, user, mahallu, committeeTypes, _i, committeeTypes_1, c, families, _a, families_1, f, generalFund, ramadanFund, rolesToCreate, _b, rolesToCreate_1, r, firstFamily;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    console.log("🌱 Seeding database...");
                    return [4 /*yield*/, bcryptjs_1.default.hash("admin123", 12)];
                case 1:
                    hashedPassword = _c.sent();
                    return [4 /*yield*/, prisma.user.upsert({
                            where: { email: "admin@muneerulislam.org" },
                            update: {},
                            create: {
                                name: "Admin",
                                email: "admin@muneerulislam.org",
                                password: hashedPassword,
                                role: "admin",
                            },
                        })];
                case 2:
                    user = _c.sent();
                    console.log("✅ Admin user created:", user.email);
                    return [4 /*yield*/, prisma.mahallu.create({
                            data: {
                                name: "Muneerul Islam Mahallu",
                                arabicName: "محل منیر الاسلام",
                                address: "Kerala, India",
                                district: "Malappuram",
                                panchayat: "",
                                phone: "",
                                email: "info@muneerulislam.org",
                                president: "",
                                secretary: "",
                                imam: "",
                            },
                        })];
                case 3:
                    mahallu = _c.sent();
                    console.log("✅ Mahallu created:", mahallu.name);
                    committeeTypes = [
                        { name: "Education Committee", type: "Education", description: "Manages educational programs and Quran classes" },
                        { name: "Welfare Committee", type: "Welfare", description: "Social welfare and charity programs" },
                        { name: "Youth Wing", type: "Youth", description: "Youth development and activities" },
                        { name: "Women's Wing", type: "Women", description: "Women empowerment programs" },
                        { name: "Finance Committee", type: "Finance", description: "Financial management and audit" },
                        { name: "Maintenance Committee", type: "Maintenance", description: "Mosque maintenance and construction" },
                    ];
                    _i = 0, committeeTypes_1 = committeeTypes;
                    _c.label = 4;
                case 4:
                    if (!(_i < committeeTypes_1.length)) return [3 /*break*/, 7];
                    c = committeeTypes_1[_i];
                    return [4 /*yield*/, prisma.committee.create({
                            data: __assign(__assign({}, c), { mahalluId: mahallu.id }),
                        })];
                case 5:
                    _c.sent();
                    _c.label = 6;
                case 6:
                    _i++;
                    return [3 /*break*/, 4];
                case 7:
                    console.log("✅ Committees created");
                    families = [
                        {
                            familyNumber: "MUI-001",
                            houseName: "Baithul Rahma",
                            houseNumber: "12/456",
                            ward: "Ward 1",
                            address: "Near Juma Masjid",
                            members: [
                                { name: "Mohammed Ashraf", relationToHead: "Head", gender: "Male", dob: "1975-03-15", maritalStatus: "Married", education: "Graduation", occupation: "Business", bloodGroup: "B+", phone: "9876543210", isVoter: true },
                                { name: "Fathima Beevi", relationToHead: "Spouse", gender: "Female", dob: "1980-06-20", maritalStatus: "Married", education: "Plus Two", occupation: "Housewife", bloodGroup: "O+", isVoter: true },
                                { name: "Ashiq Mohammed", relationToHead: "Son", gender: "Male", dob: "2002-01-10", maritalStatus: "Single", education: "Graduation", occupation: "Student", bloodGroup: "B+" },
                                { name: "Ayisha Ashraf", relationToHead: "Daughter", gender: "Female", dob: "2005-08-25", maritalStatus: "Single", education: "Plus Two", occupation: "Student", bloodGroup: "O+" },
                            ]
                        },
                        {
                            familyNumber: "MUI-002",
                            houseName: "Darul Salam",
                            houseNumber: "14/789",
                            ward: "Ward 2",
                            address: "Market Road",
                            members: [
                                { name: "Abdul Rahman", relationToHead: "Head", gender: "Male", dob: "1968-11-05", maritalStatus: "Married", education: "SSLC", occupation: "Farming", bloodGroup: "A+", phone: "9876543211", isVoter: true },
                                { name: "Sainaba", relationToHead: "Spouse", gender: "Female", dob: "1972-04-12", maritalStatus: "Married", education: "SSLC", occupation: "Housewife", bloodGroup: "A-", isVoter: true },
                                { name: "Muhammed Riyas", relationToHead: "Son", gender: "Male", dob: "1995-07-30", maritalStatus: "Married", education: "Post Graduation", occupation: "Engineer", bloodGroup: "A+", abroad: true, abroadCountry: "UAE", isVoter: true },
                                { name: "Amina Rahman", relationToHead: "Daughter", gender: "Female", dob: "1998-12-18", maritalStatus: "Married", education: "Graduation", occupation: "Teacher", bloodGroup: "B+" },
                                { name: "Hussain Rahman", relationToHead: "Son", gender: "Male", dob: "2008-09-03", maritalStatus: "Single", education: "High School", occupation: "Student", bloodGroup: "A+" },
                            ]
                        },
                        {
                            familyNumber: "MUI-003",
                            houseName: "Noor Manzil",
                            houseNumber: "7/123",
                            ward: "Ward 1",
                            address: "School Road",
                            members: [
                                { name: "Ismail Haji", relationToHead: "Head", gender: "Male", dob: "1955-02-20", maritalStatus: "Married", education: "Primary", occupation: "Retired", bloodGroup: "O-", phone: "9876543212", isVoter: true },
                                { name: "Khadeeja", relationToHead: "Spouse", gender: "Female", dob: "1960-09-14", maritalStatus: "Married", education: "Primary", occupation: "Housewife", bloodGroup: "O+", isVoter: true },
                            ]
                        },
                    ];
                    _a = 0, families_1 = families;
                    _c.label = 8;
                case 8:
                    if (!(_a < families_1.length)) return [3 /*break*/, 11];
                    f = families_1[_a];
                    return [4 /*yield*/, prisma.family.create({
                            data: {
                                familyNumber: f.familyNumber,
                                houseName: f.houseName,
                                houseNumber: f.houseNumber,
                                ward: f.ward,
                                address: f.address,
                                mahalluId: mahallu.id,
                                members: {
                                    create: f.members.map(function (m) { return ({
                                        name: m.name,
                                        relationToHead: m.relationToHead,
                                        gender: m.gender,
                                        dob: m.dob ? new Date(m.dob) : null,
                                        maritalStatus: m.maritalStatus,
                                        education: m.education,
                                        occupation: m.occupation,
                                        bloodGroup: m.bloodGroup,
                                        phone: m.phone || null,
                                        abroad: m.abroad || false,
                                        abroadCountry: m.abroadCountry || null,
                                        isVoter: m.isVoter || false,
                                    }); })
                                }
                            }
                        })];
                case 9:
                    _c.sent();
                    _c.label = 10;
                case 10:
                    _a++;
                    return [3 /*break*/, 8];
                case 11:
                    console.log("✅ Sample families & members created");
                    return [4 /*yield*/, prisma.fund.upsert({
                            where: { name: "General Fund" },
                            update: {},
                            create: { name: "General Fund", type: "general", description: "Main Mahallu Fund", isDefault: true, balance: 50000 }
                        })];
                case 12:
                    generalFund = _c.sent();
                    return [4 /*yield*/, prisma.fund.upsert({
                            where: { name: "Ramadan Relief Fund" },
                            update: {},
                            create: { name: "Ramadan Relief Fund", type: "special", description: "Zakat & Relief", isDefault: false, balance: 15000 }
                        })];
                case 13:
                    ramadanFund = _c.sent();
                    console.log("✅ Funds created");
                    // Update Families with default monthlyDueAmount
                    return [4 /*yield*/, prisma.family.updateMany({
                            data: { monthlyDueAmount: 500 }
                        })];
                case 14:
                    // Update Families with default monthlyDueAmount
                    _c.sent();
                    console.log("✅ Families updated with monthly dues");
                    rolesToCreate = [
                        { email: "president@muneerulislam.org", name: "President", role: "president" },
                        { email: "treasurer@muneerulislam.org", name: "Treasurer", role: "treasurer" },
                        { email: "secretary@muneerulislam.org", name: "Secretary", role: "secretary" },
                        { email: "dataentry@muneerulislam.org", name: "Data Entry", role: "data_entry" }
                    ];
                    _b = 0, rolesToCreate_1 = rolesToCreate;
                    _c.label = 15;
                case 15:
                    if (!(_b < rolesToCreate_1.length)) return [3 /*break*/, 18];
                    r = rolesToCreate_1[_b];
                    return [4 /*yield*/, prisma.user.upsert({
                            where: { email: r.email },
                            update: {},
                            create: { name: r.name, email: r.email, password: hashedPassword, role: r.role }
                        })];
                case 16:
                    _c.sent();
                    _c.label = 17;
                case 17:
                    _b++;
                    return [3 /*break*/, 15];
                case 18: return [4 /*yield*/, prisma.family.findFirst({ where: { familyNumber: "MUI-001" } })];
                case 19:
                    firstFamily = _c.sent();
                    if (!firstFamily) return [3 /*break*/, 21];
                    return [4 /*yield*/, prisma.user.upsert({
                            where: { email: "head001@muneerulislam.org" },
                            update: {},
                            create: {
                                name: "Family Head (Mohammed Ashraf)",
                                email: "head001@muneerulislam.org",
                                password: hashedPassword,
                                role: "family_head",
                                familyId: firstFamily.id
                            }
                        })];
                case 20:
                    _c.sent();
                    console.log("✅ Family Head user created");
                    _c.label = 21;
                case 21:
                    console.log("🎉 Seeding complete!");
                    return [2 /*return*/];
            }
        });
    });
}
main()
    .catch(function (e) {
    console.error(e);
    process.exit(1);
})
    .finally(function () { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, prisma.$disconnect()];
            case 1:
                _a.sent();
                return [2 /*return*/];
        }
    });
}); });
