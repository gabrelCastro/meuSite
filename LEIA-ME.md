# meuSite

## Acesso
- **URL:** `http://<IP-do-servidor>:3003`

## Estrutura
- **Compose file:** `/opt/meuSite/docker-compose.yml`
- **Volume de uploads:** `meuSite_uploads_data`
- **Volume do banco:** `meuSite_postgres_data`

---

## Comandos do dia a dia

```bash
# Ver status
docker ps --filter name=meuSite

# Logs em tempo real
docker logs -f meuSite

# Parar
cd /opt/meuSite && docker compose down

# Iniciar
cd /opt/meuSite && docker compose up -d

# Rebuild (após mudanças no código)
cd /opt/meuSite && docker compose up -d --build

# Backup do volume de uploads
docker run --rm -v meuSite_uploads_data:/data -v $(pwd):/backup alpine tar czf /backup/meuSite-backup.tar.gz /data
```
