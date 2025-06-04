import {
    Drawer,
    DrawerTrigger,
    DrawerContent,
    DrawerHeader,
    DrawerTitle,
    DrawerDescription,
    DrawerClose
} from '@/components/ui/drawer'
import BuildDisplay from '@/components/BuildDisplay'
import Link from 'next/link'
import { Computer } from 'lucide-react'

export default function BuildDrawer() {
    return (
        <>
            <Drawer>
                <DrawerTrigger
                    className="border lg:px-12 md:px-4 px-4 py-2 rounded-md text-sm shadow text-primary border-purple-700 hover:bg-purple-700 hover:text-white transition-colors duration-200 ease-in-out">
                    <Computer size={20}/>
                </DrawerTrigger>
                <DrawerContent className="max-h-screen">
                    <DrawerHeader>
                        <div className="flex justify-between items-center">
                            <DrawerTitle>Current Build</DrawerTitle>
                            <DrawerClose className="px-4 py-1 rounded text-sm shadow text-primary">Close</DrawerClose>
                        </div>
                        <DrawerDescription>
                            <span>This is your current build. </span>
                            <Link href="/builder" className="underline"> Click here </Link>
                            <span> to go to the build page.</span>
                        </DrawerDescription>
                    </DrawerHeader>
                    <div className="w-full h-full p-4">
                        <div className="h-full overflow-y-auto max-h-[50vh]">
                            <BuildDisplay />
                        </div>
                    </div>
                </DrawerContent>
            </Drawer>
        </>
    )
}