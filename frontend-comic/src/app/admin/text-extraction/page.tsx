'use client'

import { useState, useEffect, useCallback } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Checkbox } from '@/components/ui/checkbox'
import { Progress } from '@/components/ui/progress'
import { Badge } from '@/components/ui/badge'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Separator } from '@/components/ui/separator'
import { LoadingSpinner } from '@/components/ui/loading-spinner'
import { AlertCircle, Play, Square, CheckCircle2, Clock, FileText, Volume2 } from 'lucide-react'
import { Alert, AlertDescription } from '@/components/ui/alert'
import toast from 'react-hot-toast'

import { getComics } from '@/services/comicService'
import { getComicBySlug, getChaptersByComicId } from '@/services/detailComicService'
import { ocrService, ttsService } from '@/services/ocrAndTtsService'
import { ComicResponse } from '@/types/comic'
import { Chapter } from '@/types/chapter'
import { OcrRequest, OcrResponse } from '@/types/ocr'
import DashboardLayout from '@/components/admin/DashboardLayout'
import { constructImageUrl } from '@/utils/helpers'
import { chooseImageUrl } from '@/utils/string'

interface ProcessingStatus {
  comicId: string
  comicName: string
  selectedChapters: Chapter[]
  currentStep: 'idle' | 'ocr' | 'tts' | 'completed' | 'error'
  progress: number
  currentChapter?: string
  ocrResults?: OcrResponse[]
  error?: string
}

export default function TextExtractionPage() {
  // State quản lý dữ liệu
  const [comics, setComics] = useState<ComicResponse[]>([])
  const [chapters, setChapters] = useState<Chapter[]>([])
  const [selectedComic, setSelectedComic] = useState<string>('')
  const [selectedChapters, setSelectedChapters] = useState<string[]>([])
  const [selectAll, setSelectAll] = useState(false)

  // State quản lý loading
  const [isLoadingComics, setIsLoadingComics] = useState(true)
  const [isLoadingChapters, setIsLoadingChapters] = useState(false)

  // State quản lý xử lý
  const [processingStatus, setProcessingStatus] = useState<ProcessingStatus | null>(null)
  const [isProcessing, setIsProcessing] = useState(false)

  // Lấy danh sách truyện khi component mount
  useEffect(() => {
    fetchComics()
  }, [])

  // Lấy danh sách truyện
  const fetchComics = async () => {
    try {
      setIsLoadingComics(true)
      const response = await getComics(1, 100) // Lấy nhiều truyện để có đủ lựa chọn
      if (response.status === 200 && response.data) {
        setComics(response.data)
      } else {
        toast.error('Không thể tải danh sách truyện')
      }
    } catch (error) {
      toast.error('Lỗi khi tải danh sách truyện')
      console.error('Error fetching comics:', error)
    } finally {
      setIsLoadingComics(false)
    }
  }

  // Lấy danh sách chương khi chọn truyện
  const fetchChapters = useCallback(async (comicSlug: string) => {
    try {
      setIsLoadingChapters(true)
      const response = await getComicBySlug(comicSlug)
      if (response.status === 200 && response.data) {
        // API trả về comic detail với chapters
        const comicDetail = response.data
        console.log(comicDetail)
        if (comicDetail.chapters) {
          setChapters(comicDetail.chapters)
        } else {
          setChapters([])
        }
      } else {
        toast.error('Không thể tải danh sách chương')
        setChapters([])
      }
    } catch (error) {
      toast.error('Lỗi khi tải danh sách chương')
      console.error('Error fetching chapters:', error)
      setChapters([])
    } finally {
      setIsLoadingChapters(false)
    }
  }, [])

  // Xử lý khi chọn truyện
  const handleComicSelect = (comicId: string) => {
    setSelectedComic(comicId)
    setSelectedChapters([])
    setSelectAll(false)

    const comic = comics.find(c => c.id === comicId)
    if (comic) {
      fetchChapters(comic.slug)
    }
  }

  // Xử lý chọn/bỏ chọn chương
  const handleChapterSelect = (chapterId: string, checked: boolean) => {
    if (checked) {
      setSelectedChapters(prev => [...prev, chapterId])
    } else {
      setSelectedChapters(prev => prev.filter(id => id !== chapterId))
      setSelectAll(false)
    }
  }

  // Xử lý chọn/bỏ chọn tất cả
  const handleSelectAll = (checked: boolean) => {
    setSelectAll(checked)
    if (checked) {
      setSelectedChapters(chapters.map(chapter => chapter.id))
    } else {
      setSelectedChapters([])
    }
  }

  // Bắt đầu xử lý OCR và TTS
  const startProcessing = async () => {
    if (!selectedComic || selectedChapters.length === 0) {
      toast.error('Vui lòng chọn truyện và ít nhất một chương')
      return
    }

    const comic = comics.find(c => c.id === selectedComic)
    const selectedChapterObjects = chapters.filter(c => selectedChapters.includes(c.id))

    if (!comic) return

    setIsProcessing(true)
    setProcessingStatus({
      comicId: selectedComic,
      comicName: comic.name,
      selectedChapters: selectedChapterObjects,
      currentStep: 'ocr',
      progress: 0
    })

    try {
      const ocrRequests: OcrRequest[] = []

      // Cập nhật tiến trình cho việc lấy chi tiết chapters
      setProcessingStatus(prev => prev ? {
        ...prev,
        currentStep: 'ocr',
        progress: 10,
        currentChapter: 'Đang lấy chi tiết các chương...'
      } : null)

      // Lấy chi tiết từng chapter để có detailChapters đầy đủ
      for (let i = 0; i < selectedChapterObjects.length; i++) {
        const chapter = selectedChapterObjects[i]
        try {
          // Cập nhật tiến trình
          setProcessingStatus(prev => prev ? {
            ...prev,
            currentChapter: `Đang lấy chi tiết chương ${chapter.chapterNumber} (${i + 1}/${selectedChapterObjects.length})...`
          } : null)

          // Lấy chi tiết chapter để có detailChapters đầy đủ
          const chapterDetailResponse = await getChaptersByComicId(comic.slug, chapter.id)
          if (chapterDetailResponse.status === 200 && chapterDetailResponse.data) {
            const chapterDetail = chapterDetailResponse.data

            // Kiểm tra xem detailChapters có tồn tại
            if (chapterDetail.detailChapters) {
              for (const detailChapter of chapterDetail.detailChapters) {
                ocrRequests.push({
                  id: `${detailChapter.id}`,
                  image_url: chooseImageUrl(constructImageUrl(chapterDetail, detailChapter.imgUrl))
                })
              }
            }
          }
        } catch (error) {
          console.error(`Error fetching chapter ${chapter.id}:`, error)
        }
      }

      // Kiểm tra xem có hình ảnh nào để xử lý không
      if (!ocrRequests || ocrRequests.length === 0) {
        toast.error('Không có hình ảnh nào để xử lý')
        setIsProcessing(false)
        return
      }

      // Xử lý OCR theo batch 8 phần tử
      const batchSize = 8
      const allOcrResults: OcrResponse[] = []
      const totalBatches = Math.ceil(ocrRequests.length / batchSize)

      for (let batchIndex = 0; batchIndex < totalBatches; batchIndex++) {
        const startIndex = batchIndex * batchSize
        const endIndex = Math.min(startIndex + batchSize, ocrRequests.length)
        const batch = ocrRequests.slice(startIndex, endIndex)

        // Cập nhật tiến trình OCR
        const ocrProgress = 25 + (batchIndex / totalBatches) * 40 // OCR từ 25% đến 65%
        setProcessingStatus(prev => prev ? {
          ...prev,
          currentStep: 'ocr',
          progress: Math.round(ocrProgress),
          currentChapter: `Đang xử lý OCR batch ${batchIndex + 1}/${totalBatches} (${batch.length} hình ảnh)...`
        } : null)

        try {
          const batchResults = await ocrService.multiImageOcr(batch)
          allOcrResults.push(...batchResults)
        } catch (error) {
          console.error(`Error processing OCR batch ${batchIndex + 1}:`, error)
          break;
        }
      }

      // Cập nhật tiến trình
      setProcessingStatus(prev => prev ? {
        ...prev,
        currentStep: 'tts',
        progress: 75,
        currentChapter: 'Đang xử lý TTS...',
        ocrResults: allOcrResults
      } : null)

      // Gọi TTS service cho từng kết quả OCR
      for (const result of allOcrResults) {
        await ttsService.ocrAndTts({
          id: result.id,
          ocr_items: JSON.stringify(result.items)
        })
      }

      // Hoàn thành
      setProcessingStatus(prev => prev ? {
        ...prev,
        currentStep: 'completed',
        progress: 100,
        currentChapter: 'Hoàn thành!'
      } : null)

      toast.success('Xử lý OCR và TTS thành công!')

    } catch (error) {
      console.error('Processing error:', error)
      setProcessingStatus(prev => prev ? {
        ...prev,
        currentStep: 'error',
        error: 'Có lỗi xảy ra trong quá trình xử lý'
      } : null)
      toast.error('Có lỗi xảy ra trong quá trình xử lý')
    } finally {
      setIsProcessing(false)
    }
  }

  // Dừng xử lý
  const stopProcessing = () => {
    setIsProcessing(false)
    setProcessingStatus(null)
    toast('Đã dừng xử lý')
  }

  // Reset form
  const resetForm = () => {
    setSelectedComic('')
    setSelectedChapters([])
    setSelectAll(false)
    setChapters([])
    setProcessingStatus(null)
  }

  return (
    <DashboardLayout title="Trích xuất văn bản & Tạo âm thanh">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Trích xuất văn bản & Tạo âm thanh</h1>
            <p className="text-muted-foreground">
              Xử lý OCR để trích xuất văn bản và tạo file âm thanh TTS cho các chương truyện
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Panel cấu hình */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Cấu hình xử lý
              </CardTitle>
              <CardDescription>
                Chọn truyện và các chương cần xử lý OCR và TTS
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Chọn truyện */}
              <div className="space-y-2">
                <label className="text-sm font-medium">Chọn truyện</label>
                <Select value={selectedComic} onValueChange={handleComicSelect} disabled={isProcessing}>
                  <SelectTrigger>
                    <SelectValue placeholder={isLoadingComics ? "Đang tải..." : "Chọn truyện"} />
                  </SelectTrigger>
                  <SelectContent>
                    {comics.map((comic) => (
                      <SelectItem key={comic.id} value={comic.id}>
                        {comic.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Danh sách chương */}
              {selectedComic && (
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="text-sm font-medium">Chọn chương</label>
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="select-all"
                        checked={selectAll}
                        onCheckedChange={handleSelectAll}
                        disabled={isProcessing || chapters.length === 0}
                      />
                      <label htmlFor="select-all" className="text-sm">
                        Chọn tất cả ({chapters.length})
                      </label>
                    </div>
                  </div>

                  <ScrollArea className="h-64 border rounded-md p-3">
                    {isLoadingChapters ? (
                      <div className="flex items-center justify-center py-8">
                        <LoadingSpinner />
                      </div>
                    ) : chapters.length === 0 ? (
                      <div className="text-center py-8 text-muted-foreground">
                        Không có chương nào
                      </div>
                    ) : (
                      <div className="space-y-2">
                        {chapters.map((chapter) => (
                          <div key={chapter.id} className="flex items-center space-x-2">
                            <Checkbox
                              id={chapter.id}
                              checked={selectedChapters.includes(chapter.id)}
                              onCheckedChange={(checked) => handleChapterSelect(chapter.id, checked as boolean)}
                              disabled={isProcessing}
                            />
                            <label htmlFor={chapter.id} className="text-sm flex-1 cursor-pointer">
                              Chương {chapter.chapterNumber}: {chapter.title}
                            </label>
                          </div>
                        ))}
                      </div>
                    )}
                  </ScrollArea>
                </div>
              )}

              {/* Nút điều khiển */}
              <div className="flex gap-2 pt-4">
                <Button
                  onClick={startProcessing}
                  disabled={!selectedComic || selectedChapters.length === 0 || isProcessing}
                  className="flex-1"
                >
                  {isProcessing ? (
                    <>
                      <LoadingSpinner className="mr-2 h-4 w-4" />
                      Đang xử lý...
                    </>
                  ) : (
                    <>
                      <Play className="mr-2 h-4 w-4" />
                      Bắt đầu xử lý
                    </>
                  )}
                </Button>

                {isProcessing && (
                  <Button variant="destructive" onClick={stopProcessing}>
                    <Square className="mr-2 h-4 w-4" />
                    Dừng
                  </Button>
                )}

                <Button variant="outline" onClick={resetForm} disabled={isProcessing}>
                  Đặt lại
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Panel trạng thái */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Volume2 className="h-5 w-5" />
                Trạng thái xử lý
              </CardTitle>
              <CardDescription>
                Theo dõi tiến trình xử lý OCR và TTS
              </CardDescription>
            </CardHeader>
            <CardContent>
              {!processingStatus ? (
                <div className="text-center py-8 text-muted-foreground">
                  <Clock className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>Chưa bắt đầu xử lý</p>
                  <p className="text-sm">Chọn truyện và chương để bắt đầu</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {/* Thông tin cơ bản */}
                  <div>
                    <h3 className="font-medium">{processingStatus.comicName}</h3>
                    <p className="text-sm text-muted-foreground">
                      {processingStatus.selectedChapters.length} chương được chọn
                    </p>
                  </div>

                  <Separator />

                  {/* Trạng thái hiện tại */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Trạng thái:</span>
                      <Badge variant={
                        processingStatus.currentStep === 'completed' ? 'default' :
                          processingStatus.currentStep === 'error' ? 'destructive' :
                            'secondary'
                      }>
                        {processingStatus.currentStep === 'ocr' && 'Đang OCR'}
                        {processingStatus.currentStep === 'tts' && 'Đang TTS'}
                        {processingStatus.currentStep === 'completed' && 'Hoàn thành'}
                        {processingStatus.currentStep === 'error' && 'Lỗi'}
                        {processingStatus.currentStep === 'idle' && 'Chờ xử lý'}
                      </Badge>
                    </div>

                    {/* Tiến trình */}
                    <div className="space-y-1">
                      <div className="flex items-center justify-between text-sm">
                        <span>Tiến trình</span>
                        <span>{processingStatus.progress}%</span>
                      </div>
                      <Progress value={processingStatus.progress} className="h-2" />
                    </div>

                    {/* Thông tin chi tiết */}
                    {processingStatus.currentChapter && (
                      <p className="text-sm text-muted-foreground">
                        {processingStatus.currentChapter}
                      </p>
                    )}
                  </div>

                  {/* Lỗi */}
                  {processingStatus.error && (
                    <Alert variant="destructive">
                      <AlertCircle className="h-4 w-4" />
                      <AlertDescription>
                        {processingStatus.error}
                      </AlertDescription>
                    </Alert>
                  )}

                  {/* Kết quả OCR */}
                  {processingStatus.ocrResults && processingStatus.ocrResults.length > 0 && (
                    <div className="space-y-2">
                      <h4 className="text-sm font-medium">Kết quả OCR:</h4>
                      <ScrollArea className="h-32 border rounded p-2">
                        <div className="space-y-1 text-xs">
                          {processingStatus.ocrResults.map((result, index) => (
                            <div key={index} className="flex items-center gap-2">
                              <CheckCircle2 className="h-3 w-3 text-green-500" />
                              <span>Trang {result.id}: {result.items.length} văn bản được trích xuất</span>
                            </div>
                          ))}
                        </div>
                      </ScrollArea>
                    </div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  )
} 