'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { getAdminDashboardSummary, type AdminDashboardResult } from '@/lib/storage';
import type { AdminDashboardSummary } from '@/types';
import { formatPrice } from '@/lib/format';
import { Package, FileText, DollarSign, TrendingUp, Users, ArrowRight, AlertCircle, RefreshCw } from 'lucide-react';
import { useMounted } from '@/lib/useMounted';

const APPLICATION_STATUS_LABEL = {
  pending: '승인 대기',
  reviewing: '서류 검토 중',
  supplement_required: '보완 요청',
  active: '승인 완료',
  rejected: '반려',
} as const;

export default function AdminDashboard() {
  const mounted = useMounted();
  const [data, setData] = useState<AdminDashboardSummary | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchData = () => {
    setLoading(true);
    setError(null);
    getAdminDashboardSummary().then((result: AdminDashboardResult) => {
      if (result.ok) {
        setData(result.data);
      } else {
        setError(result.message || '데이터를 불러오는데 실패했습니다.');
      }
      setLoading(false);
    });
  };

  useEffect(() => {
    fetchData();
  }, []);

  if (!mounted) return null;

  if (loading) {
    return (
      <div className="space-y-8 animate-pulse">
        <div className="h-8 bg-gray-200 rounded w-32 mb-8"></div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map(i => (
            <div key={i} className="bg-white p-6 rounded-sm border border-gray-200 h-32"></div>
          ))}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="bg-white rounded-sm border border-gray-200 h-64"></div>
          <div className="bg-white rounded-sm border border-gray-200 h-64"></div>
        </div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="flex flex-col items-center justify-center p-12 bg-white rounded-sm border border-gray-200">
        <AlertCircle className="size-12 text-red-500 mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">대시보드 오류</h3>
        <p className="text-sm text-gray-500 mb-6">{error || '데이터가 없습니다.'}</p>
        <button
          onClick={fetchData}
          className="flex items-center gap-2 px-4 py-2 bg-gray-900 text-white rounded-sm hover:bg-gray-800 transition-colors"
        >
          <RefreshCw className="size-4" />
          다시 시도
        </button>
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-8">대시보드</h1>
      
      {/* 핵심 지표 Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white p-6 rounded-sm shadow-sm border border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-medium text-gray-500">누적 매출</h3>
            <div className="h-10 w-10 bg-blue-50 text-blue-600 rounded-lg flex items-center justify-center"><DollarSign className="h-5 w-5" /></div>
          </div>
          <div className="text-2xl font-bold text-gray-900">{formatPrice(data.revenue.totalPaidAmount)}</div>
        </div>
        
        <div className="bg-white p-6 rounded-sm shadow-sm border border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-medium text-gray-500">신규 주문 (오늘)</h3>
            <div className="h-10 w-10 bg-green-50 text-green-600 rounded-lg flex items-center justify-center"><Package className="h-5 w-5" /></div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold text-gray-900">{data.orders.newCount}건</span>
            <span className="text-xs text-gray-500">대기: {data.orders.pendingCount}건</span>
          </div>
        </div>

        <div className="bg-white p-6 rounded-sm shadow-sm border border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-medium text-gray-500">보험 분석 대기</h3>
            <div className="h-10 w-10 bg-orange-50 text-orange-600 rounded-lg flex items-center justify-center"><FileText className="h-5 w-5" /></div>
          </div>
          <div className="flex items-baseline gap-2">
             <span className="text-2xl font-bold text-gray-900">{data.insuranceAnalyses.pendingCount}건</span>
             <span className="text-xs text-gray-500">검토중: {data.insuranceAnalyses.reviewingCount}건</span>
          </div>
        </div>

        <div className="bg-white p-6 rounded-sm shadow-sm border border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-medium text-gray-500">등록 상품 수</h3>
            <div className="h-10 w-10 bg-purple-50 text-purple-600 rounded-lg flex items-center justify-center"><TrendingUp className="h-5 w-5" /></div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold text-gray-900">{data.products.totalCount}개</span>
            <span className="text-xs text-gray-500">노출: {data.products.activeCount}개</span>
          </div>
        </div>
      </div>

      {/* 회원 유형별 현황 (Compact Card Section) */}
      <div className="mb-8 bg-white rounded-sm shadow-sm border border-gray-200 overflow-hidden">
        <div className="p-4 border-b border-gray-200 bg-gray-50 flex items-center gap-2">
          <Users className="size-4 text-gray-500" />
          <h3 className="text-sm font-bold text-gray-900">회원 및 제휴 가입 현황</h3>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-4 divide-y sm:divide-y-0 sm:divide-x divide-gray-200">
           <Link href="/admin/members" className="p-4 flex flex-col hover:bg-gray-50 transition-colors group">
             <span className="text-xs text-gray-500 mb-1">일반 회원</span>
             <div className="flex items-end justify-between mt-auto">
               <span className="text-lg font-bold text-gray-900">{data.applications.totalUsers}명</span>
               <span className="text-xs text-green-600 group-hover:underline flex items-center gap-1">신규 {data.applications.todayNewUsers}명 <ArrowRight className="size-3" /></span>
             </div>
           </Link>
           <Link href="/admin/members" className="p-4 flex flex-col hover:bg-gray-50 transition-colors group">
             <span className="text-xs text-gray-500 mb-1">입점업체 승인 대기</span>
             <div className="flex items-end justify-between mt-auto">
               <span className={`text-lg font-bold ${data.applications.partnerPendingCount > 0 ? 'text-orange-600' : 'text-gray-900'}`}>{data.applications.partnerPendingCount}건</span>
               <span className="text-xs text-gray-400 group-hover:text-gray-900 group-hover:underline flex items-center gap-1">관리 <ArrowRight className="size-3" /></span>
             </div>
           </Link>
           <Link href="/admin/members" className="p-4 flex flex-col hover:bg-gray-50 transition-colors group">
             <span className="text-xs text-gray-500 mb-1">보험사회원 승인 대기</span>
             <div className="flex items-end justify-between mt-auto">
               <span className={`text-lg font-bold ${data.applications.insurancePendingCount > 0 ? 'text-orange-600' : 'text-gray-900'}`}>{data.applications.insurancePendingCount}건</span>
               <span className="text-xs text-gray-400 group-hover:text-gray-900 group-hover:underline flex items-center gap-1">관리 <ArrowRight className="size-3" /></span>
             </div>
           </Link>
           <Link href="/admin/members" className="p-4 flex flex-col hover:bg-gray-50 transition-colors group">
             <span className="text-xs text-gray-500 mb-1">B2B회원 승인 대기</span>
             <div className="flex items-end justify-between mt-auto">
               <span className={`text-lg font-bold ${data.applications.b2bPendingCount > 0 ? 'text-orange-600' : 'text-gray-900'}`}>{data.applications.b2bPendingCount}건</span>
               <span className="text-xs text-gray-400 group-hover:text-gray-900 group-hover:underline flex items-center gap-1">관리 <ArrowRight className="size-3" /></span>
             </div>
           </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent Orders */}
        <div className="bg-white rounded-sm shadow-sm border border-gray-200 overflow-hidden flex flex-col">
          <div className="p-6 border-b border-gray-200 flex justify-between items-center shrink-0">
            <h3 className="text-lg font-bold text-gray-900">최근 주문</h3>
            <Link href="/admin/orders" className="text-xs text-gray-500 hover:text-gray-900">전체보기</Link>
          </div>
          <div className="p-0 overflow-x-auto flex-1 min-h-[250px]">
            {data.recentOrders.length === 0 ? (
              <div className="flex items-center justify-center h-full text-sm text-gray-500">최근 내역이 없습니다.</div>
            ) : (
              <table className="w-full min-w-[480px] text-left text-sm">
                <thead className="bg-gray-50 text-gray-500">
                  <tr>
                    <th className="px-6 py-3 font-medium">주문자</th>
                    <th className="px-6 py-3 font-medium">결제금액</th>
                    <th className="px-6 py-3 font-medium">상태</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {data.recentOrders.map(order => (
                    <tr key={order.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4">{order.customerName}</td>
                      <td className="px-6 py-4">{formatPrice(order.totalAmount)}</td>
                      <td className="px-6 py-4">
                        <span className="px-2 py-1 text-xs font-medium bg-gray-100 text-gray-800 rounded-full">{order.status}</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>

        {/* Recent Insurance */}
        <div className="bg-white rounded-sm shadow-sm border border-gray-200 overflow-hidden flex flex-col">
          <div className="p-6 border-b border-gray-200 flex justify-between items-center shrink-0">
            <h3 className="text-lg font-bold text-gray-900">최근 보험 분석 신청</h3>
            <Link href="/admin/insurance" className="text-xs text-gray-500 hover:text-gray-900">전체보기</Link>
          </div>
          <div className="p-0 overflow-x-auto flex-1 min-h-[250px]">
            {data.recentInsurances.length === 0 ? (
              <div className="flex items-center justify-center h-full text-sm text-gray-500">최근 내역이 없습니다.</div>
            ) : (
              <table className="w-full min-w-[480px] text-left text-sm">
                <thead className="bg-gray-50 text-gray-500">
                  <tr>
                    <th className="px-6 py-3 font-medium">반려동물</th>
                    <th className="px-6 py-3 font-medium">보호자</th>
                    <th className="px-6 py-3 font-medium">상태</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {data.recentInsurances.map(app => (
                    <tr key={app.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4">{app.petName}</td>
                      <td className="px-6 py-4">{app.ownerName}</td>
                      <td className="px-6 py-4">
                        <span className="px-2 py-1 text-xs font-medium bg-gray-100 text-gray-800 rounded-full">{app.status}</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>
      
      {/* Recent Applications (가입 승인 대기) */}
      <div className="mt-8 bg-white rounded-sm shadow-sm border border-gray-200 overflow-hidden flex flex-col">
        <div className="p-6 border-b border-gray-200 flex justify-between items-center shrink-0">
          <h3 className="text-lg font-bold text-gray-900">최근 가입 승인 요청</h3>
          <Link href="/admin/members" className="text-xs text-gray-500 hover:text-gray-900">전체보기</Link>
        </div>
        <div className="p-0 overflow-x-auto flex-1 min-h-[200px]">
          {data.recentApplications.length === 0 ? (
            <div className="flex items-center justify-center h-full py-12 text-sm text-gray-500">최근 요청 내역이 없습니다.</div>
          ) : (
            <table className="w-full min-w-[600px] text-left text-sm">
              <thead className="bg-gray-50 text-gray-500">
                <tr>
                  <th className="px-6 py-3 font-medium">요청일</th>
                  <th className="px-6 py-3 font-medium">회원유형</th>
                  <th className="px-6 py-3 font-medium">이름/상호</th>
                  <th className="px-6 py-3 font-medium">상태</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {data.recentApplications.map(app => (
                  <tr key={app.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 text-gray-500">{new Date(app.createdAt).toLocaleDateString('ko-KR')}</td>
                    <td className="px-6 py-4">
                      {app.role === 'partner' ? '입점업체' : app.role === 'insurance' ? '보험사회원' : app.role === 'b2b' ? 'B2B회원' : app.role}
                    </td>
                    <td className="px-6 py-4">
                      {app.companyName ? `${app.companyName} (${app.name})` : app.name}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                        app.status === 'pending' ? 'bg-orange-100 text-orange-800' :
                        app.status === 'rejected' ? 'bg-red-100 text-red-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {APPLICATION_STATUS_LABEL[app.status as keyof typeof APPLICATION_STATUS_LABEL] || app.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

    </div>
  );
}
