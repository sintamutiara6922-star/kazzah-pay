'use client'

import { useState } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { PaymentMethod, PaymentType } from '@/types'
import { formatCurrency } from '@/lib/utils'
import { Check, Clock } from 'lucide-react'
import { cn } from '@/lib/utils'

interface MethodSelectorProps {
  methods: PaymentMethod[]
  selectedMethod: string | null
  onSelect: (method: PaymentMethod) => void
  amount: number
}

export function MethodSelector({ methods, selectedMethod, onSelect, amount }: MethodSelectorProps) {
  const [activeTab, setActiveTab] = useState<PaymentType>('qris')

  const groupedMethods = {
    qris: methods.filter((m) => m.type === 'qris'),
    ewallet: methods.filter((m) => m.type === 'ewallet'),
    va: methods.filter((m) => m.type === 'va'),
    bank: methods.filter((m) => m.type === 'bank'),
  }

  const isMethodAvailable = (method: PaymentMethod) => {
    return (
      method.status === 'aktif' &&
      (typeof method.min === 'number' ? amount >= method.min : amount >= Number(method.min)) &&
      (typeof method.max === 'number' ? amount <= method.max : amount <= Number(method.max))
    )
  }

  return (
    <div className="space-y-4 md:space-y-6">
      <Label className="text-base md:text-lg font-semibold">Pilih Metode Pembayaran</Label>
      
      <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as PaymentType)} className="w-full">
        <TabsList className="grid w-full grid-cols-2 md:grid-cols-4 gap-2 p-1 md:p-1.5 h-auto">
          <TabsTrigger value="qris" className="text-xs md:text-sm py-2.5 md:py-2">QRIS</TabsTrigger>
          <TabsTrigger value="ewallet" className="text-xs md:text-sm py-2.5 md:py-2">E-Wallet</TabsTrigger>
          <TabsTrigger value="va" className="text-xs md:text-sm py-2.5 md:py-2 whitespace-nowrap">Virtual Account</TabsTrigger>
          <TabsTrigger value="bank" className="text-xs md:text-sm py-2.5 md:py-2 whitespace-nowrap">Bank Transfer</TabsTrigger>
        </TabsList>

        {Object.entries(groupedMethods).map(([type, methodsList]) => (
          <TabsContent key={type} value={type} className="mt-5 md:mt-6">
            {methodsList.length === 0 ? (
              <p className="py-8 text-center text-sm text-muted-foreground">
                Tidak ada metode tersedia
              </p>
            ) : (
              <div className="grid gap-4 md:gap-4 grid-cols-1 md:grid-cols-2">
                {methodsList.map((method) => {
                  const available = isMethodAvailable(method)
                  const isSelected = selectedMethod === method.metode
                  
                  return (
                    <Card
                      key={method.metode}
                      className={cn(
                        'cursor-pointer transition-all duration-200 hover:border-primary/50 hover:shadow-md border-2',
                        isSelected && 'border-primary ring-2 ring-primary/20 shadow-lg bg-primary/5',
                        !available && 'cursor-not-allowed opacity-50'
                      )}
                      onClick={() => available && onSelect(method)}
                    >
                      <CardContent className="p-5 md:p-6">
                        <div className="flex flex-col space-y-4">
                          <div className="flex items-start justify-between gap-3">
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2 mb-2">
                                <h3 className="font-bold text-base md:text-lg leading-tight">{method.name}</h3>
                                {isSelected && (
                                  <div className="shrink-0 flex h-5 w-5 items-center justify-center rounded-full bg-primary">
                                    <Check className="h-3 w-3 text-primary-foreground" />
                                  </div>
                                )}
                              </div>
                              <p className="text-xs md:text-sm text-muted-foreground font-mono">
                                {method.metode}
                              </p>
                            </div>
                          </div>
                          <div className="flex flex-wrap items-center gap-2">
                            <Badge variant="secondary" className="text-xs py-1 px-2">
                              <Clock className="mr-1.5 h-3 w-3" />
                              {method.status === 'aktif' ? 'Aktif' : 'Tidak Aktif'}
                            </Badge>
                            {Number(method.fee) > 0 || Number(method.fee_persen) > 0 ? (
                              <Badge variant="outline" className="text-xs py-1 px-2">
                                Fee: {Number(method.fee) > 0 ? formatCurrency(Number(method.fee)) : ''}
                                {Number(method.fee) > 0 && Number(method.fee_persen) > 0 ? ' + ' : ''}
                                {Number(method.fee_persen) > 0 ? `${method.fee_persen}%` : ''}
                              </Badge>
                            ) : (
                              <Badge variant="outline" className="text-xs py-1 px-2 text-green-600 border-green-600">
                                Gratis
                              </Badge>
                            )}
                          </div>
                          {!available && (
                            <div className="pt-2 border-t">
                              <p className="text-xs font-medium text-destructive">
                                {amount < Number(method.min)
                                  ? `Minimal: ${formatCurrency(Number(method.min))}`
                                  : `Maksimal: ${formatCurrency(Number(method.max))}`}
                              </p>
                            </div>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  )
                })}
              </div>
            )}
          </TabsContent>
        ))}
      </Tabs>
    </div>
  )
}
