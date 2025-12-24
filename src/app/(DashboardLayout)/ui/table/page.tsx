'use client';

import React from 'react';
import { Icon } from '@iconify/react';
import { MoreVertical } from 'lucide-react';
import Image from 'next/image';
import product1 from '/public/images/products/s1.jpg';
import product2 from '/public/images/products/s2.jpg';
import product3 from '/public/images/products/s3.jpg';
import product4 from '/public/images/products/s4.jpg';
import product5 from '/public/images/products/s5.jpg';
import { StaticImageData } from 'next/image';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { cn } from '@/lib/utils';

type Status = 'success' | 'warning' | 'error' | 'secondary';

interface Product {
  img: StaticImageData;
  name: string;
  payment: string;
  paymentstatus: string;
  process: number;
  processcolor: Status;
  statuscolor: Status;
  statustext: string;
}

const ProductsTable = () => {
  const ProductTableData: Product[] = [
    {
      img: product1,
      name: 'iPhone 13 pro max-Pacific Blue-128GB storage',
      payment: '$180',
      paymentstatus: 'Partially paid',
      process: 45,
      processcolor: 'warning',
      statuscolor: 'secondary',
      statustext: 'Confirmed',
    },
    {
      img: product2,
      name: 'Apple MacBook Pro 13 inch-M1-8/256GB-space',
      payment: '$120',
      paymentstatus: 'Full paid',
      process: 100,
      processcolor: 'success',
      statuscolor: 'success',
      statustext: 'Confirmed',
    },
    {
      img: product3,
      name: 'PlayStation 5 DualSense Wireless Controller',
      payment: '$120',
      paymentstatus: 'Cancelled',
      process: 100,
      processcolor: 'error',
      statuscolor: 'error',
      statustext: 'Cancelled',
    },
    {
      img: product5,
      name: 'Amazon Basics Mesh, Mid-Back, Swivel Office',
      payment: '$120',
      paymentstatus: 'Partially paid',
      process: 45,
      processcolor: 'warning',
      statuscolor: 'secondary',
      statustext: 'Confirmed',
    },
    {
      img: product4,
      name: 'Sony X85J 75 Inch Sony 4K Ultra HD LED Smart',
      payment: '$120',
      paymentstatus: 'Full paid',
      process: 100,
      processcolor: 'success',
      statuscolor: 'success',
      statustext: 'Confirmed',
    },
  ];

  const tableActionData = [
    {
      icon: 'solar:add-circle-outline',
      listtitle: 'Add',
    },
    {
      icon: 'solar:pen-new-square-broken',
      listtitle: 'Edit',
    },
    {
      icon: 'solar:trash-bin-minimalistic-outline',
      listtitle: 'Delete',
    },
  ];

  const getProgressColor = (color: Status) => {
    switch (color) {
      case 'success':
        return 'bg-green-500';
      case 'warning':
        return 'bg-yellow-500';
      case 'error':
        return 'bg-red-500';
      default:
        return 'bg-secondary';
    }
  };

  const getBadgeVariant = (color: Status): 'default' | 'secondary' | 'destructive' | 'outline' => {
    switch (color) {
      case 'success':
        return 'default';
      case 'warning':
        return 'outline';
      case 'error':
        return 'destructive';
      default:
        return 'secondary';
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Table</CardTitle>
      </CardHeader>
      <CardContent>
        <div className='overflow-x-auto'>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className='w-[400px]'>Products</TableHead>
                <TableHead>Payment</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className='w-[50px]'></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {ProductTableData.map((item, index) => (
                <TableRow key={index}>
                  <TableCell>
                    <div className='flex gap-3 items-center'>
                      <Image src={item.img} alt={item.name} className='h-[60px] w-[60px] rounded-md object-cover' />
                      <div className='max-w-[280px]'>
                        <p className='text-sm font-medium line-clamp-2'>{item.name}</p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className='space-y-2'>
                      <p className='text-base font-medium'>
                        {item.payment}
                        <span className='text-muted-foreground mx-1'>/499</span>
                      </p>
                      <p className='text-sm text-muted-foreground'>{item.paymentstatus}</p>
                      <Progress value={item.process} className={cn('h-2', getProgressColor(item.processcolor))} />
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant={getBadgeVariant(item.statuscolor)}>{item.statustext}</Badge>
                  </TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <button className='h-9 w-9 flex items-center justify-center rounded-full hover:bg-accent'>
                          <MoreVertical className='h-5 w-5' />
                        </button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align='end'>
                        {tableActionData.map((action, index) => (
                          <DropdownMenuItem key={index} className='flex items-center gap-2 cursor-pointer'>
                            <Icon icon={action.icon} height={18} />
                            <span>{action.listtitle}</span>
                          </DropdownMenuItem>
                        ))}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
};

export default ProductsTable;
