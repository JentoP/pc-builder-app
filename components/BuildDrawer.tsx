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
                    className="border border-primary px-4 py-1 rounded-md text-sm text-primary hover:bg-primary/90 hover:text-primary-foreground">
                    View Build
                </DrawerTrigger>
                <DrawerContent className="max-h-screen">
                    <DrawerHeader>
                        <div className="flex justify-between items-center">
                            <DrawerTitle>Current Build</DrawerTitle>
                            <DrawerClose className="px-4 py-1 rounded text-sm bg-red-600 text-white">Close</DrawerClose>
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