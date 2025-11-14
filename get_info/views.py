from django.shortcuts import render
from django.http import JsonResponse
import json

import yt_dlp

# Create your views here.

def get_media_info(request):
    if request.method == 'POST':
        try:
            data = json.loads(request.body)
            url = data.get('url')
            if not url:
                return JsonResponse({'error': 'URL no proporcionada'}, status=400)

            ydl_opts = {
                'quiet': True,
                'skip_download': True,
                'noplaylist': True,
            }

            with yt_dlp.YoutubeDL(ydl_opts) as ydl:
                info = ydl.extract_info(url, download=False)

                video_info = {
                    'title': info.get('title', 'Título desconocido'),
                    'uploader': info.get('uploader', 'Artista desconocido'),
                    'duration': info.get('duration', 0),
                    'thumbnail': info.get('thumbnail', ''),
                }
                return JsonResponse({'video_info': video_info})
        
        except Exception as e:
            return JsonResponse({'error': f'Error al procesar la URL: {str(e)}'}, status=500)
        
    return JsonResponse({'error': 'Método no permitido'}, status=405)
