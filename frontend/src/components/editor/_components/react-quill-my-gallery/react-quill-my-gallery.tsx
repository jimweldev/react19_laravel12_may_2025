import 'react-quill-new/dist/quill.snow.css';
import { useState } from 'react';
import { useDebouncedState } from '@mantine/hooks';
import { keepPreviousData, useQuery } from '@tanstack/react-query';
import { FaArrowRotateRight, FaSpinner, FaThumbtack } from 'react-icons/fa6';
import ReactPaginate from 'react-paginate';
import { toast } from 'sonner';
import type { PaginatedRecords } from '@/_types/common/paginated-records';
import type { Gallery } from '@/_types/gallery';
import ReactImage from '@/components/images/react-image';
import GallerySkeleton from '@/components/skeletons/gallery-skeleton';
import ToolTip from '@/components/tool-tips/tool-tip';
import { Button } from '@/components/ui/button';
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
} from '@/components/ui/context-menu';
import {
  Dialog,
  DialogBody,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { mainInstance } from '@/instances/main-instance';
import DeleteImage from './_components/delete-image';
import RenameImage from './_components/rename-image';
import UploadImage from './_components/upload-image';

type ReactQuillEditorProps = {
  open: boolean;
  setOpen: (open: boolean) => void;
  onSelectImage: (url: string) => void;
};

const ReactQuillMyGallery = ({
  open,
  setOpen,
  onSelectImage: onSelectImageHandler,
}: ReactQuillEditorProps) => {
  const [openUploadImage, setOpenUploadImage] = useState<boolean>(false);

  const [limit, setLimit] = useState<string>('18');
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [sort, setSort] = useState('-created_at');
  const [searchTerm, setSearchTerm] = useDebouncedState('', 200);

  const {
    data: galleries,
    isLoading,
    isFetching,
    error,
    refetch,
  } = useQuery<PaginatedRecords<Gallery>>({
    queryKey: ['galleries/paginate', searchTerm, limit, currentPage, sort],
    queryFn: async ({ signal }): Promise<PaginatedRecords<Gallery>> => {
      const res = await mainInstance.get(
        `/api/galleries/paginate?search=${searchTerm}&limit=${limit}&page=${currentPage}&sort=${sort}`,
        {
          signal,
        },
      );
      return res.data;
    },
    placeholderData: keepPreviousData,
    enabled: open,
  });

  const [selectedImage, setSelectedImage] = useState<Gallery | null>(null);
  const [openRenameGallery, setOpenRenameGallery] = useState<boolean>(false);
  const [openDeleteGallery, setOpenDeleteGallery] = useState<boolean>(false);

  const onSelectImage = (gallery: Gallery) => {
    if (!selectedImage) {
      setSelectedImage(gallery);
    } else {
      if (selectedImage.id === gallery.id) {
        setSelectedImage(null);
      } else {
        setSelectedImage(gallery);
      }
    }
  };

  const onSubmit = (image?: Gallery) => {
    const finalImage = image || selectedImage;
    if (!finalImage) {
      toast.error('Please select an image.');
      return;
    }

    onSelectImageHandler(
      `${import.meta.env.VITE_STORAGE_BASE_URL}/${finalImage.file_path}`,
    );
    setSelectedImage(null);
    setOpen(false);
  };

  const onTogglePin = (image: Gallery) => {
    toast.promise(
      mainInstance.patch(`/api/galleries/${image?.id}`, {
        is_pinned: !image.is_pinned,
      }),
      {
        loading: 'Loading...',
        success: () => {
          refetch();
          return 'Success!';
        },
        error: error => {
          return (
            error.response?.data?.message ||
            error.message ||
            'An error occurred'
          );
        },
      },
    );
  };

  const handlePageChange = ({ selected }: { selected: number }) =>
    setCurrentPage(selected + 1);

  return (
    <>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="@container/dialog" size="lg">
          <DialogHeader>
            <DialogTitle>My Gallery</DialogTitle>
            <DialogDescription>
              Select an image from your Gallery
            </DialogDescription>
          </DialogHeader>
          <DialogBody>
            <div className="space-y-3">
              <div className="flex flex-col items-center justify-between gap-2 @xl/dialog:flex-row">
                <div className="flex gap-2">
                  <Button size="sm" onClick={() => setOpenUploadImage(true)}>
                    Upload
                  </Button>
                </div>

                <div className="flex flex-col items-center justify-between gap-2 @lg/dialog:flex-row">
                  <Input
                    inputSize="sm"
                    placeholder="Search"
                    onChange={e => {
                      setCurrentPage(1);
                      setSearchTerm(e.target.value);
                      setSelectedImage(null);
                    }}
                  />

                  <Select
                    value={sort}
                    onValueChange={value => {
                      setSort(value);
                      setCurrentPage(1);
                      setSelectedImage(null);
                    }}
                  >
                    <SelectTrigger
                      size="sm"
                      className="w-[100px] min-w-[100px]"
                    >
                      <SelectValue placeholder="Select entry" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        <SelectItem value="created_at">↑ Date</SelectItem>
                        <SelectItem value="-created_at">↓ Date</SelectItem>
                        <SelectItem value="file_name">↑ Name</SelectItem>
                        <SelectItem value="-file_name">↓ Name</SelectItem>
                      </SelectGroup>
                    </SelectContent>
                  </Select>

                  <div className="flex gap-2">
                    <Select
                      value={limit}
                      onValueChange={value => {
                        setLimit(value);
                        setCurrentPage(1);
                        setSelectedImage(null);
                      }}
                    >
                      <SelectTrigger
                        size="sm"
                        className="w-[75px] min-w-[75px]"
                      >
                        <SelectValue placeholder="Select entry" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          <SelectItem value="18">18</SelectItem>
                          <SelectItem value="24">24</SelectItem>
                          <SelectItem value="30">30</SelectItem>
                        </SelectGroup>
                      </SelectContent>
                    </Select>

                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        refetch();
                      }}
                    >
                      {isFetching ? (
                        <FaSpinner className="animate-spin" />
                      ) : (
                        <FaArrowRotateRight />
                      )}
                    </Button>
                  </div>
                </div>
              </div>

              <hr className={`${isFetching ? 'border-primary' : ''}`} />

              {isLoading ? (
                <GallerySkeleton inputCount={+limit} />
              ) : error ? (
                <h1>Error</h1>
              ) : galleries?.records?.length === 0 ? (
                <div className="w-full rounded-md border-2 p-8">
                  <h1 className="text-muted-foreground text-center">
                    No images found
                  </h1>
                </div>
              ) : (
                <div className="grid grid-cols-12 gap-3">
                  {galleries?.records?.map(gallery => (
                    <div className="col-span-2" key={gallery.id}>
                      <ContextMenu>
                        <ContextMenuTrigger asChild>
                          <div className="relative transition-transform duration-200 ease-in-out hover:scale-105">
                            <div
                              className={`aspect-square w-full cursor-pointer overflow-hidden rounded-md border-2 ${
                                selectedImage?.id === gallery.id
                                  ? 'border-primary'
                                  : 'border-muted'
                              }`}
                              onClick={() => onSelectImage(gallery)}
                              onDoubleClick={() => onSubmit(gallery)}
                            >
                              <ReactImage
                                src={`${import.meta.env.VITE_STORAGE_BASE_URL}/${gallery.file_path}`}
                                alt={gallery.file_name}
                                className="h-full w-full object-cover"
                              />
                            </div>
                            {gallery.is_pinned ? (
                              <FaThumbtack className="absolute -top-1 -right-1 rotate-45 text-green-600 drop-shadow-md/50" />
                            ) : null}
                          </div>
                        </ContextMenuTrigger>
                        <ContextMenuContent>
                          <ContextMenuItem onClick={() => onTogglePin(gallery)}>
                            {gallery.is_pinned ? 'Unpin' : 'Pin'}
                          </ContextMenuItem>
                          <ContextMenuItem
                            onClick={() => {
                              setSelectedImage(gallery);
                              setOpenRenameGallery(true);
                            }}
                          >
                            Rename
                          </ContextMenuItem>
                          <ContextMenuItem
                            onClick={() => {
                              setSelectedImage(gallery);
                              setOpenDeleteGallery(true);
                            }}
                          >
                            Delete
                          </ContextMenuItem>
                        </ContextMenuContent>
                      </ContextMenu>

                      <ToolTip content={gallery.file_name || ''}>
                        <p className="line-clamp-2 text-center text-xs text-wrap break-all">
                          {gallery.file_name}
                        </p>
                      </ToolTip>
                    </div>
                  ))}
                </div>
              )}

              <div className="flex flex-col items-center justify-between gap-2 @xl/dialog:flex-row">
                <span className="text-muted-foreground text-sm">
                  {`Showing ${
                    (galleries?.records?.length || 0) > 0
                      ? (currentPage - 1) * Number(limit) + 1
                      : 0
                  } to ${(currentPage - 1) * Number(limit) + (galleries?.records?.length || 0)} of ${
                    galleries?.info?.total || 0
                  } entries`}
                </span>
                <ReactPaginate
                  containerClassName="pagination pagination-sm"
                  pageCount={galleries?.info?.pages || 1}
                  marginPagesDisplayed={1}
                  pageRangeDisplayed={3}
                  onPageChange={handlePageChange}
                  forcePage={currentPage - 1}
                  previousLabel={<>&laquo;</>}
                  nextLabel={<>&raquo;</>}
                  breakLabel="..."
                  activeClassName="active"
                />
              </div>
            </div>
          </DialogBody>
          <DialogFooter className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button onClick={() => onSubmit(selectedImage!)}>Select</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <UploadImage
        open={openUploadImage}
        setOpen={setOpenUploadImage}
        refetch={refetch}
      />
      <RenameImage
        open={openRenameGallery}
        setOpen={setOpenRenameGallery}
        refetch={refetch}
        selectedItem={selectedImage!}
      />
      <DeleteImage
        selectedItem={selectedImage!}
        setSelectedItem={setSelectedImage}
        open={openDeleteGallery}
        setOpen={setOpenDeleteGallery}
        refetch={refetch}
      />
    </>
  );
};

export default ReactQuillMyGallery;
