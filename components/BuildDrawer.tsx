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

export default function BuildDrawer() {
    return (
        <>
            <Drawer>
                <DrawerTrigger
                    className="rounded-md text-sm font-medium bg-primary text-primary-foreground hover:bg-primary/90 px-4 py-2">
                    View Current Build
                </DrawerTrigger>
                <DrawerContent className="max-h-screen">
                    <DrawerHeader>
                        <div className="flex justify-between items-center">
                            <DrawerTitle>Current Build</DrawerTitle>
                            <DrawerClose className="px-4 py-2 rounded bg-red-600 text-white">Close</DrawerClose>
                        </div>
                        <DrawerDescription>
                            <span>This is your current build. </span>
                            <Link href="/builder" className="underline"> Click here </Link>
                            <span> to go to the build page.</span>
                        </DrawerDescription>
                    </DrawerHeader>
                    <div className="p-4">
                        <BuildDisplay/>
                    </div>
                </DrawerContent>
            </Drawer>
        </>
    )
}