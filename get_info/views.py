from django.shortcuts import render
from django.http import JsonResponse

import yt_dlp

# Create your views here.

def info_view(request):
    if request.method == 'POST':
        url = request.POST.get('url')
        if url:
            try:
                ydl_opts = {
                    'quiet': True,
                    'skip_download': True,
                    'noplaylist': True
                }

                with yt_dlp.YoutubeDL(ydl_opts) as ydl:
                    info = ydl.extract_info(url, download=False)

                    video_info = {
                        'title': info.get('title', 'Unknown Title'),
                        'artist': info.get('uploader', 'Unknown Artist'),
                        'duration': info.get('duration', 'Unknown Duration'),
                        'thumbnail': info.get('thumbnail', '')
                    }

                    print(video_info)
                return JsonResponse({'video_info':video_info})
            
            except Exception as e:
                error_message = f'Error: {str(e)}'
                return JsonResponse({'error': error_message})
            
    return JsonResponse({'error': 'Método no permitido'}, status=400)
