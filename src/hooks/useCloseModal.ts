import { useCallback, useEffect, useState } from "react";


export const useCloseModal = ({animationDuration = 100}:any) => {
    const [isOpen, setIsOpen] = useState(false);
    const [isClosing, setIsClosing] = useState(false);

    const openModal = useCallback(() => {
      setIsClosing(false);
      setIsOpen(true);
    }, []);

    const closeModal = useCallback(() => {
      setIsClosing(true);
        
      setTimeout(() => {
        setIsOpen(false);
        setIsClosing(false);
      }, animationDuration);
    }, [animationDuration]);

    const closeModalKey = (e:any) => {
      if (e.key == "Escape") {
        closeModal()
      }
    }

    useEffect(() => {
      window.addEventListener("keydown",closeModalKey)

      return () => window.removeEventListener("keydown",closeModalKey)
    },[closeModal])

    const toggleModal = useCallback(() => {
        isOpen ? closeModal() : openModal()
    },[isOpen,openModal,closeModal])

  return {
    isOpen,
    isClosing,
    openModal,
    closeModal,
    toggleModal,
    modalClass: isClosing ? 'closing' : ''
  }
}
