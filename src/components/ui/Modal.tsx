'use client'

import React, { Fragment } from 'react'
import { Dialog, DialogPanel, DialogTitle, Transition, TransitionChild } from '@headlessui/react'
import { XMarkIcon } from '@heroicons/react/24/outline'

export interface ModalProps {
    isOpen: boolean
    onClose: () => void
    title?: string,
    subtitle?: string
    children: React.ReactNode
    footer?: React.ReactNode
}

export function Modal({ isOpen = false, onClose, title, children, footer, subtitle }: ModalProps) {
    return (
        <Transition appear show={isOpen} as={Fragment}>
            <Dialog as="div" className="relative z-50" onClose={onClose}>
                <TransitionChild
                    as={Fragment}
                    enter="ease-out duration-300"
                    enterFrom="opacity-0"
                    enterTo="opacity-100"
                    leave="ease-in duration-200"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0"
                >
                    <div className="fixed inset-0 bg-black/25 backdrop-blur-sm" />
                </TransitionChild>

                <div className="fixed inset-0 overflow-y-auto">
                    <div className="flex min-h-full items-center justify-center p-4 text-center">
                        <TransitionChild
                            as={Fragment}
                            enter="ease-out duration-300"
                            enterFrom="opacity-0 scale-95"
                            enterTo="opacity-100 scale-100"
                            leave="ease-in duration-200"
                            leaveFrom="opacity-100 scale-100"
                            leaveTo="opacity-0 scale-95"
                        >
                            <DialogPanel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                                <div className="flex items-center justify-between mb-4">
                                    <div className="flex flex-col">
                                        {title && (
                                            <DialogTitle
                                                as="h3"
                                                className="text-lg font-medium leading-6 text-gray-900"
                                            >
                                                {title}
                                            </DialogTitle>
                                        )}
                                        {subtitle && (
                                            <DialogTitle
                                                as="p"
                                                className="text-xs font-medium leading-6 text-indigo-700"
                                            >
                                                {subtitle}
                                            </DialogTitle>
                                        )}
                                    </div>
                                    <button
                                        onClick={onClose}
                                        className="text-gray-400 hover:text-gray-500 focus:outline-none"
                                    >
                                        <XMarkIcon className="h-5 w-5" />
                                    </button>
                                </div>

                                <div className="mt-2">
                                    {children}
                                </div>

                                {footer && (
                                    <div className="mt-6 flex justify-end gap-3">
                                        {footer}
                                    </div>
                                )}
                            </DialogPanel>
                        </TransitionChild>
                    </div>
                </div>
            </Dialog>
        </Transition>
    )
}
