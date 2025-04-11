FROM mysql:8.0.41-debian

WORKDIR /app
COPY pinjam_lab.sql ./

RUN chown mysql:mysql pinjam_lab.sql
RUN chmod 644 pinjam_lab.sql

EXPOSE 3306
