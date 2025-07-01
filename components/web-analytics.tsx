'use client';

import { useEffect, useState } from 'react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Cell, ResponsiveContainer
} from 'recharts';
import {
  Card, CardContent, CardDescription, CardHeader, CardTitle
} from '@/components/ui/card';
import { Tabs, TabsContent } from '@/components/ui/tabs';
import RealTimeVisitors from './real-time-visitors';
import { usePageView } from '@/hooks/usePageView';
import { getActiveUserCount, getActivePages } from '@/app/helpers/trackAnalytics';

const COLORS = ['#8884d8', '#83a6ed', '#8dd1e1', '#82ca9d', '#a4de6c', '#d0ed57', '#ffc658', '#ff8042'];

interface Props {
  stats: {
    total: number;
    rutasCount: { [key: string]: number };
    countryCount: { [key: string]: number };
  };
}

export default function WebAnalyticsClient({ stats }: Props) {
  usePageView();

  const [timeRange, setTimeRange] = useState('anual');
  const [activeUsers, setActiveUsers] = useState(0);
  const [activePages, setActivePages] = useState(0);

  useEffect(() => {
    const updateActive = () => {
      setActiveUsers(getActiveUserCount());
      setActivePages(Object.keys(getActivePages()).length);
    };
    updateActive();
    const interval = setInterval(updateActive, 5000);
    return () => clearInterval(interval);
  }, []);

  const formatNumber = (number: number | undefined | null) => {
    if (typeof number !== 'number' || isNaN(number)) return '0';
    if (number >= 1000000) return (number / 1000000).toFixed(1) + 'M';
    if (number >= 1000) return (number / 1000).toFixed(1) + 'K';
    return number.toString();
  };

  const pageData = Object.entries(stats.rutasCount).map(([name, visits]) => ({ name, visits }));
  const countryData = Object.entries(stats.countryCount).map(([name, visits]) => ({ name, visits }));

  return (
    <div className="grid gap-6">
      <RealTimeVisitors activeUsers={activeUsers} pageViews={stats.total} />
      <Tabs defaultValue="anual" className="w-full" onValueChange={setTimeRange}>
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 gap-4">
          <h2 className="text-2xl font-semibold">Estadísticas de Tráfico</h2>
        </div>
        <div className="grid gap-6 grid-cols-1 md:grid-cols-3">
          <Card className="md:col-span-3">
            <CardHeader>
              <CardTitle>Total de Visitas</CardTitle>
              <CardDescription>{formatNumber(stats.total)} visitas en total</CardDescription>
            </CardHeader>
            <CardContent>
              <TabsContent value="anual" className="mt-0">
                <div className="w-full h-[220px] sm:h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={[{ name: 'Visitas', visits: stats.total }]} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} />
                      <XAxis dataKey="name" />
                      <YAxis tickFormatter={formatNumber} />
                      <Bar dataKey="visits" fill="#8884d8" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </TabsContent>
            </CardContent>
          </Card>

          <Card className="md:col-span-3 lg:col-span-2">
            <CardHeader>
              <CardTitle>Páginas más Visitadas</CardTitle>
              <CardDescription>Rutas con mayor tráfico en el sitio</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="w-full h-[220px] sm:h-[400px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={pageData} layout="vertical" margin={{ top: 20, right: 30, left: 20, bottom: 40 }}>
                    <CartesianGrid strokeDasharray="3 3" horizontal vertical={false} />
                    <XAxis type="number" tickFormatter={formatNumber} />
                    <YAxis type="category" dataKey="name" width={100} />
                    <Bar dataKey="visits" fill="#82ca9d">
                      {pageData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          <Card className="md:col-span-3 lg:col-span-1">
            <CardHeader>
              <CardTitle>Países con más visitas</CardTitle>
              <CardDescription>Top países por visitas</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="w-full h-[220px] sm:h-[400px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={countryData} layout="vertical" margin={{ top: 20, right: 30, left: 20, bottom: 40 }}>
                    <CartesianGrid strokeDasharray="3 3" horizontal vertical={false} />
                    <XAxis type="number" />
                    <YAxis type="category" dataKey="name" width={100} />
                    <Bar dataKey="visits" fill="#ffc658">
                      {countryData.map((entry, index) => (
                        <Cell key={`cell-country-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </div>
      </Tabs>
    </div>
  );
}
