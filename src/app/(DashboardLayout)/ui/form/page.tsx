'use client';

import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const FormPage = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Form</CardTitle>
      </CardHeader>
      <CardContent>
        <div className='grid grid-cols-12 gap-6'>
          <div className='lg:col-span-6 col-span-12'>
            <div className='space-y-4'>
              <div className='space-y-2'>
                <Label htmlFor='name'>Your Name</Label>
                <Input id='name' type='text' placeholder='Your Name' required />
              </div>

              <div className='space-y-2'>
                <Label htmlFor='email'>Your Email</Label>
                <Input id='email' type='email' placeholder='name@materialm.com' required />
              </div>

              <div className='space-y-2'>
                <Label htmlFor='password'>Your Password</Label>
                <Input id='password' type='password' required />
              </div>
            </div>
          </div>

          <div className='lg:col-span-6 col-span-12'>
            <div className='space-y-4'>
              <div className='space-y-2'>
                <Label htmlFor='country'>Country</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder='Select a country' />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value='india'>India</SelectItem>
                    <SelectItem value='canada'>Canada</SelectItem>
                    <SelectItem value='france'>France</SelectItem>
                    <SelectItem value='germany'>Germany</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className='space-y-2'>
                <Label htmlFor='state'>State</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder='Select a state' />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value='delhi'>Delhi</SelectItem>
                    <SelectItem value='gujarat'>Gujarat</SelectItem>
                    <SelectItem value='mumbai'>Mumbai</SelectItem>
                    <SelectItem value='chennai'>Chennai</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className='space-y-2'>
                <Label htmlFor='city'>City</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder='Select a city' />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value='rajkot'>Rajkot</SelectItem>
                    <SelectItem value='ahmedabad'>Ahmedabad</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          <div className='col-span-12 flex gap-3'>
            <Button>Submit</Button>
            <Button variant='destructive'>Cancel</Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default FormPage;
