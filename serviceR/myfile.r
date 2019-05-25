# myfile.R

#* @filter cors
cors <- function(res) {
  res$setHeader("Access-Control-Allow-Origin", "*")
  plumber::forward()
}

#* @get /clusterG
clusterG <- function(){
  # Lecture du fichier
  AnalyseCerveau <- read.csv(file="../data/country.csv",header=FALSE,dec=",") 
  AnalyseCerveauG <- AnalyseCerveau[,1:80]
  
  pcaG <- prcomp(AnalyseCerveauG, center = TRUE, scale = FALSE)
  pcaG <- pcaG$x[,1:2]
  pcaG <- unlist(pcaG)
  
  DG <- dist(pcaG, method="euclidean")
  
  
  AscHierarchiqueG <- hclust(DG, method="complete")
  
  
  clusterG = cutree(AscHierarchiqueG,3)
  
  #AFFICHER CA !!!!
  
  afficherG <- cbind(pcaG, clusterG)
  
  afficherG
  
}

#* @get /clusterD
clusterD <- function(){
  # Lecture du fichier
  AnalyseCerveau <- read.csv(file="../data/country.csv",header=FALSE,dec=",") 
  
  AnalyseCerveauD <- AnalyseCerveau[,81:160]
  
  pcaD <- prcomp(AnalyseCerveauD, center = TRUE, scale = FALSE)
  
  pcaD <- pcaD$x[,1:2]
  
  pcaD <- unlist(pcaD)
  
  DD <- dist(pcaD, method="euclidean")
  
  
  AscHierarchiqueD <- hclust(DD, method="complete")
  
  
  clusterD = cutree(AscHierarchiqueD,3)
  #AFFICHER CA !!!!
  afficherD <- cbind(pcaD, clusterD)
  
  
  afficherD
  
  
}


#* @get /intersection
intersection <- function(){
  # Lecture du fichier
  AnalyseCerveau <- read.csv(file="../data/country.csv",header=FALSE,dec=",")
  AnalyseCerveauG <- AnalyseCerveau[,1:80]
  AnalyseCerveauD <- AnalyseCerveau[,81:160]
  
  pcaG <- prcomp(AnalyseCerveauG, center = TRUE, scale = FALSE)
  pcaG <- pcaG$x[,1:2]
  pcaG <- unlist(pcaG)
  
  pcaD <- prcomp(AnalyseCerveauD, center = TRUE, scale = FALSE)
  pcaD <- pcaD$x[,1:2]
  pcaD <- unlist(pcaD)
  
  DG <- dist(pcaG, method="euclidean")
  DD <- dist(pcaD, method="euclidean")
  
  AscHierarchiqueG <- hclust(DG, method="complete")
  clusterG = cutree(AscHierarchiqueG,3)
  
  AscHierarchiqueD <- hclust(DD, method="complete")
  clusterD = cutree(AscHierarchiqueD,3)
  
  c <-  cbind(clusterG,clusterD)
  
  c1 <-  0
  c2 <-  0
  c3 <- 0
  c4 <- 0
  c5 <- 0
  c6 <- 0
  c7 <- 0
  c8 <- 0
  c9 <- 0
  
  
  for (i in 1:nrow(c)) 
  {
    if(c[i,1]==1 && c[i,2]==1) 
    {
      c1= c1+1
    }
    if(c[i,1]==1 && c[i,2]==2)
    {
      c2= c2+1
    }
    if(c[i,1]==1 && c[i,2]==3)
    {
      c3= c3+1
    }
    
    
    if(c[i,1]==2 && c[i,2]==1) 
    {
      c4= c4+1
    }
    if(c[i,1]==2 && c[i,2]==2)
    {
      c5= c5+1
    }
    if(c[i,1]==2 && c[i,2]==3)
    {
      c6= c6+1
    }
    
    
    
    if(c[i,1]==3 && c[i,2]==1) 
    {
      c7= c7+1
    }
    if(c[i,1]==3 && c[i,2]==2)
    {
      c8= c8+1
    }
    if(c[i,1]==3 && c[i,2]==3)
    {
      c9= c9+1
    }
    
    
    
  }
  GV <- c(c1,c4,c7)
  GB <- c(c2,c5,c8)
  GR <- c(c3,c6,c9)
  
  inter <- cbind(GV,GB,GR)
  colnames(inter) <- c("DV", "DB","DR")
  rownames(inter) <- c("DV", "DB","DR")
  
  inter
}
