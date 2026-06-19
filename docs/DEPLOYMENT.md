# Deployment Guide

EcoTrack AI is container-ready and built to launch on modern cloud infrastructure platforms (GCP Cloud Run, AWS App Runner).

## 1. Preparing the Frontend

The React UI needs to be compiled to static files.

```bash
npm run build
```
This generates the optimized bundle in the `/dist` directory. These files can be natively hosted on Vercel, Netlify, or standard Amazon S3 buckets.

## 2. Containerizing the Backend

Deploying the FastAPI backend via Docker guarantees environment consistency.

**Sample Dockerfile:**
```dockerfile
FROM python:3.11-slim
WORKDIR /app
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt
COPY . .
EXPOSE 8000
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]
```

Build and push the image:
```bash
docker build -t ecotrack-api .
docker push gcr.io/your-project/ecotrack-api
```

## 3. Cloud Provisioning

### Google Cloud Run (Recommended)
Cloud Run allows the API to scale to zero, minimizing operational costs.

1. Navigate to Google Cloud Console.
2. Select Cloud Run > Create Service.
3. Select your pushed container image.
4. Set environment variables (e.g., `DATABASE_URL`).
5. Expose as an unauthenticated service.
6. Map the frontend API URLs to your newly generated `.run.app` domain.

## 4. CI/CD Pipelines

Create a `.github/workflows/deploy.yml` pipeline that triggers on push to the `main` branch:
1. Run `npm test` and `pytest`.
2. Upon success, execute the `docker build`.
3. Push to registry and trigger the deployment update rollout automatically.
