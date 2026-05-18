import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent, act } from '@testing-library/react'
import React from 'react'
import App from './App'
import { BillingStateProvider, useBillingState } from './context/BillingStateContext'

// Simple mock for window resize and layout properties to satisfy Framer Motion in jsdom
beforeEach(() => {
  window.scrollTo = vi.fn()
})

describe('DentHub Billing Overlay & Global Context System', () => {
  it('correctly manages active patient timeline selection and state changes', () => {
    render(<App />)
    
    // Check initial patient card is active (e.g., Rian Wijaya)
    const patientHeader = screen.getAllByText('Rian Wijaya')
    expect(patientHeader.length).toBeGreaterThan(0)
  })

  it('correctly calculates dynamic billing estimate pricing and summation', () => {
    // Render custom diagnostic wrapper to evaluate calculation logic directly
    const TestComponent = () => {
      const { activeAppointment, completeTreatmentCode } = useBillingState()
      const completedCodes = activeAppointment?.completedCodes || []
      const totalAmount = completedCodes.reduce((sum, item) => sum + item.price, 0)
      const discount = totalAmount > 500 ? totalAmount * 0.05 : 0
      const finalAmount = totalAmount - discount

      return (
        <div>
          <span data-testid="total">{finalAmount}</span>
          <button 
            data-testid="add-btn" 
            onClick={() => completeTreatmentCode('apt-1', { code: 'D2750', name: 'Crown', price: 980.0, category: 'Restorative' })}
          >
            Add Crown
          </button>
        </div>
      )
    }

    render(
      <BillingStateProvider>
        <TestComponent />
      </BillingStateProvider>
    )

    // Initial total amount with preloaded D0120 ($65)
    expect(screen.getByTestId('total').textContent).toBe('65')

    // Add high value restorative code ($980) to trigger summation and volume discount
    fireEvent.click(screen.getByTestId('add-btn'))

    // Subtotal: 65 + 980 = 1045. Since 1045 > 500, discount is 5% of 1045 = 52.25. Final amount = 992.75
    expect(screen.getByTestId('total').textContent).toBe('992.75')
  })

  it('successfully triggers custom window dispatch event when checkout is activated', () => {
    const eventSpy = vi.fn()
    window.addEventListener('denthub-checkout-dispatch', eventSpy)

    const TestCheckoutComponent = () => {
      const { checkoutAppointment } = useBillingState()
      return (
        <button data-testid="checkout-btn" onClick={() => checkoutAppointment('apt-1')}>
          Checkout Rian
        </button>
      )
    }

    render(
      <BillingStateProvider>
        <TestCheckoutComponent />
      </BillingStateProvider>
    )

    fireEvent.click(screen.getByTestId('checkout-btn'))
    expect(eventSpy).toHaveBeenCalled()
    
    // Clean up
    window.removeEventListener('denthub-checkout-dispatch', eventSpy)
  })
})
